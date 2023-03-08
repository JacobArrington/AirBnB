const express = require('express')
const { setTokenCookie, requireAuth,restoreUser} = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const {Op} = require('sequelize')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');
const router = express.Router();


// let validateQuery =[
//     check('page').isInt({min:1,max:10}).withMessage('Page must between 1 and 10'),
//     check('size').isInt({min: 1, max:20}).withMessage('Size must be between 1 and 20'),
//     check('minLat').isDecimal({min: -90.00}).withMessage('Minimum latitude is invalid'),
//     check('maxLat').isDecimal({max: 90.00}).withMessage('Maximum latitude is invalid'),
//     check('minLng').isDecimal({min: -180.00}).withMessage('Minimum longitude is invalid'),
//     check('maxLng').isDecimal({max: 180.00}).withMessage('Maximum longitude is invalid'),
//     check('minPrice').isDecimal({min: 0}).withMessage('Minimum price must be greater than or equal to 0'),
//     check('maxPrice').isDecimal({min: 0}).withMessage('Maximum price must be greater than or equal to 0'),
//     handleValidationErrors
// ]

router.get('/', async (req, res) => {
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query

    if (!page || Number.isNaN(page) || page > 10) { page = 1 }
    if (!size || Number.isNaN(size) || size > 20) { size = 20 }
    if (!minLat) { minLat = -90 }
    if (!maxLat) { maxLat = 90 }
    if (!minLng) { minLng = -180 }
    if (!maxLng) { maxLng = 180 }
    if (!minPrice) { minPrice = 1 }
    if (!maxPrice) { maxPrice = 100000 }
    page = Number(page)
    size = Number(size)
    //console.log(page,size, "!!!!!!!!!!!!!")
    const spots = await Spot.findAll({
    
        where: {
            //lat: { [Op.between]: [minLat, maxLat] },
            //lng: { [Op.between]: [minLng, maxLng] },
            price: { [Op.between]: [minPrice, maxPrice] },
        },
/*
        attributes: {

            include: [[sequelize.fn('COALESCE', sequelize.fn('AVG',
             sequelize.col('Reviews.stars')), 0), 'avgRating'],
            [sequelize.fn('COALESCE', sequelize.col('SpotImages.url'),
             sequelize.literal("'no image preview has been uploaded'")),
              'previewImage']]
              */
            /* 
            COALESCE returns the first non null val 
            using to grab the star if there is only one review
            then if more then one value finds the avg of the stars on the review table
            passing 0 as a defult value then returnin the avg to the spots table
            
            */
        //},
        include: [{
            model: Review,
            
        },
        {
            model: SpotImage,
           
        }],

        //group: ['Spot.id', 'SpotImages.url'],
        offset: (page - 1) * size ,
        limit: size
    
        })
       spots.forEach(spot =>{
        spot.SpotImages.forEach(image=>{
            if (image.dataValues.preview){
                spot.dataValues.previewImage = image.url
                
            }else{
                spot.dataValues.previewImage = "no preview Image"
            }
            delete spot.dataValues.SpotImages
            let sum = 0 
            if (spot.Reviews.length){
                spot.Reviews.forEach(review =>{
                sum += review.dataValues.stars
                })
                sum = sum/spot.Reviews.length
                spot.dataValues.avgRating = sum
                
            }else{
                spot.dataValues.avgRating = sum

            }
            delete spot.dataValues.Reviews
           
            
        })
       })
        
       
    res.json({ 
        Spots:spots,
        //page,
        //size
        

})
})


router.get('/current',requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        attributes: {

            include: [[sequelize.fn('COALESCE', sequelize.fn('AVG',
            sequelize.col('Reviews.stars')), 0), 'averageStarRating'],
           [sequelize.fn('COALESCE', sequelize.col('SpotImages.url'),
            sequelize.literal("'no image preview has been uploaded'")),
             'previewImage']]


        },

        include: [{
            model: Review,
            required: false,
            attributes: [],
            subQuery: false,
        },
        {
            model: SpotImage,
            required: false,
            where: { preview: true },
            attributes: []
        }],

        group: ['Spot.id', 'SpotImages.url', 'Spot.ownerId']

    })
    res.json({ Spots:spots })
})

router.get('/:id/reviews', async(req,res)=>{
    const spotId = req.params.id

    const spot = await Spot.findByPk(spotId);
     if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
    });
}
   
    const reviews = await Review.findAll({
        where:{spotId},
       
        include:[
            {
                model: User,
                attributes: ['id','firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: []
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
 
    
    res.json({Reviews:reviews})
})

router.get('/:id', async (req, res) => {
    const spotId = req.params.id
    const spot = await Spot.findByPk(spotId, {
        include: [{
            model: Review,
            
            
        },
        {
            model: SpotImage,
           
        }],


    })

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    let sum = 0;
    if (spot.Reviews.length) {
        spot.Reviews.forEach(review => {
            sum += review.dataValues.stars;
        });
        sum = sum / spot.Reviews.length;
        spot.dataValues.avgStarRating = sum;
    } else {
        spot.dataValues.avgStarRating = sum;
    }
    spot.dataValues.numReviews = spot.Reviews.length;

    const user = await User.findOne({ where: { id: spot.ownerId } });
    spot.dataValues.Owner = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
    };

    const images = await SpotImage.findAll({
        where: { spotId: spotId },
        attributes: ['id', 'url', 'preview']
    });
    spot.dataValues.SpotImages = images;
    delete spot.dataValues.Reviews

    res.json({ Spot: spot });
    
    
})
   
   
router.get('/:id/bookings',requireAuth, async(req,res)=>{
    const spotId = req.params.id

    const spot = await Spot.findByPk(spotId);
    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    const isOwner = req.user.id === spot.ownerId

    let bookings;
    if(isOwner) {
        bookings = await Booking.findAll({
            where: {spotId},
            include: [
                {
                    model: User,
                    attributes:['id', 'firstName', 'lastName']
                }
            ]
        })
    }else{
        bookings = await Booking.findAll({
            where: {spotId},
            attributes:['spotId','startDate', 'endDate']
                
            
        })
    }
    res.json({Bookings: bookings})
})








   const ValidateSpot = [
        check('address').exists({ checkFalsy: true }).not().withMessage('Street address is required'),
        check('city').exists({ checkFalsy: true }).not().withMessage('City is required'),
        check('state').exists({ checkFalsy: true }).not().withMessage('State is required'),
        check('country').exists({ checkFalsy: true }).not().withMessage('Country is required'),
        //check('lat').isDecimal({ checkFalsy: true }).withMessage('Latitude is not valid'),
        //check('lng').isDecimal({ checkFalsy: true }).withMessage('Longitude is not valid'),
        check('name').isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
        check('description').exists({ checkFalsy: true }).not().withMessage('Description is required'),
        check('price').exists({ checkFalsy: true }).not().withMessage('Price per day is required'),
       handleValidationErrors
    ]

    const validateReview =[
        check('review').exists().notEmpty().withMessage("Review text is required"),
        check('stars').exists().isInt({min: 1, max:5}).withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors
     ]

router.post('/',requireAuth,ValidateSpot, async (req, res) => {
    
        const { name, description, price, address, city, state,
            country, lat, lng, } = req.body;
        const spot = await Spot.create({
              name,
              description,
              price,
              address,
              city,
              state,
              country,
              lat,
              lng,
              ownerId: req.user.id,
             
        });
        
        res.json(spot);

    })
    
router.post('/:id/images',requireAuth, async(req,res) =>{
    const {url,preview} = req.body
    const spotId = req.params.id
    const spot = await Spot.findByPk(spotId,{
       
    });
   

    if(!spot){
        return res.status(404).json({
            message:"Spot couldn't be found",
            statusCode:404
        })
    }
    if(spot.ownerId !== req.user.id){
        return res.status(401).json({
            message:"only the spot owner can add an image",
            statusCode: 401
        })
    }
    const image = await SpotImage.create({
        
        url,
        preview
    })
    spot.addSpotImages([image])
    res.json({
        id: image.id,
        url: image.url,
        preview: image.preview
    })
})
router.post('/:id/reviews',requireAuth,validateReview,async(req,res)=>{
    const spotId = req.params.id
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }
    const existingReview = await Review.findOne({
        where:{
            spotId: spotId,
            userId: req.user.id
        }
    })
    if(existingReview){
        return res.status(403).json({
            message:"User already has a review for this spot",
            statusCode: 403
        })
    }

    const { review, stars } = req.body;
    const newReview = await Review.create({
        userId: req.user.id,
        spotId: spotId,
        review,
        stars
    });
    res.status(201).json(newReview);
})


router.post('/:id/bookings', requireAuth, async(req,res)=>{
    const spotId = req.params.id
    const { startDate, endDate } = req.body
    const spot = await Spot.findByPk(spotId)

    if(!spot){
        return res.status(404).json({
            message:"Spot couldnt be found",
            statusCode: 404
        })
    }
    if(spot.OwnerId === req.user.id){
        return res.status(403).json(
        {
            message: 'You cannot book your own spot',
            statusCode: 403
        }
        )
    }
    if(endDate <= startDate){
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors:[
                "endDate cannot be on or before startDate"
            ]
        })
    } 
    const existingBookings = await Booking.findAll({
         attributes:[[sequelize.fn('date',sequelize.col('startDate')),'startDate'],
         [sequelize.fn('date',sequelize.col('endDate')),'endDate']],
        where: {spotId,
            [Op.or]:[
                {startDate: {[Op.between]: [startDate, endDate]}},
                {endDate: {[Op.between]: [startDate, endDate]}},
                {startDate:{[Op.lte]: startDate},endDate:{[Op.gte]: endDate}}
            ]
        }
    }) 
    if(existingBookings.length){
        return res.status(403).json({
            message:"Sorry, this spot is already booked for the specified dates",
            statusCode: 403 ,
            errors:[
                "Start date conflicts with an existing booking",
                "End date conflicts with an existing booking"
            ]
        })
    }
    const booking = await Booking.create({
        
        userId: req.user.id,
        spotId: spotId,
        startDate: new Date(req.body.startDate).toISOString().slice(0, 10),
        endDate: new Date(req.body.endDate).toISOString().slice(0, 10),
    })
    res.json(booking)
})
// edit a spot

  router.put('/:id',requireAuth,ValidateSpot, async(req,res)=>{
   const spotId = req.params.id
   const updateSpot = req.body
   const spot = await Spot.findOne({
     where:{
        id: spotId,
        ownerId: req.user.id
    }
    
   })  
  if(!spot){
    return res.status(404).json({
       message: "Spot couldn't be found",
        statusCode: 404
    })
}

     await spot.update(updateSpot);
     res.status(200).json(spot)
     
 
})

router.delete('/:id', requireAuth, async (req, res) => {
    const spotId = req.params.id;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Couldn't find a Spot with the specified id",
        statusCode: 404
      });
    }
    if (spot.ownerId !== req.user.id) {
      return res.status(401).json({
        message: "You are not authorized to delete this spot",
        statusCode: 401
      });
    }
    await spot.destroy();
    res.json(spot);
   
  });

module.exports = router;
