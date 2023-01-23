const express = require('express')
const { setTokenCookie, requireAuth,restoreUser} = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');

const { validationResult } = require('express-validator');
const router = express.Router();

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        attributes: {

            include: [[sequelize.fn('COALESCE', sequelize.fn('AVG',
             sequelize.col('Reviews.stars')), 0), 'averageStarRating'],
            [sequelize.fn('COALESCE', sequelize.col('SpotImages.url'),
             sequelize.literal("'no image preview has been uploaded'")),
              'previewImage']]
            /* 
            COALESCE returns the first non null val 
            using to grab the star if there is only one review
            then if more then one value finds the avg of the stars on the review table
            passing 0 as a defult value then returnin the avg to the spots table
            
            */
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

        group: ['Spot.id']

    })
    res.json({ spots })

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

        group: ['Spot.id']

    })
    res.json({ spots })
})

router.get('/:id', async (req, res) => {
    const spotId = req.params.id
    const spot = await Spot.findByPk(spotId, {
        attributes: {

            include: [[sequelize.fn('COALESCE', sequelize.fn('AVG',
                sequelize.col('Reviews.stars')), 0), 'averageStarRating'],
                // [sequelize.fn('COALESCE', sequelize.col('SpotImages.url'),
                // sequelize.literal("'no image preview has been uploaded'")),
                //  'previewImage'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.id')),'numReviews']],
            // make sure all spot images 

        },

        include: [{
            model: Review,
            required: false,
            attributes: [],
            subQuery: false,
        },
      
        {
            model:User,
            as:'Owner',
            attributes: ['id','firstName','lastName'],
        }
    ],

        group: ['Spot.id']


    })
    const image = await SpotImage.findAll({
        where:{
             spotId: spotId
        },
        attributes:['id','url', 'preview']
    });
   
    
    

    
    if(!spot){
        return res.status(404).json({
            message:"Spot couldn't be found",
            statusCode: 404
        })
    }else{
        spot.dataValues.SpotImages = image
    }
    res.json(spot)
})

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



   const ValidateSpot = [
        check('address').exists({ checkFalsy: true }).not().withMessage('Street address is required'),
        check('city').exists({ checkFalsy: true }).not().withMessage('City is required'),
        check('state').exists({ checkFalsy: true }).not().withMessage('State is required'),
        check('country').exists({ checkFalsy: true }).not().withMessage('Country is required'),
        check('lat').isDecimal({ checkFalsy: true }).withMessage('Latitude is not valid'),
        check('lng').isDecimal({ checkFalsy: true }).withMessage('Longitude is not valid'),
        check('name').isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
        check('description').exists({ checkFalsy: true }).not().withMessage('Description is required'),
        check('price').exists({ checkFalsy: true }).not().withMessage('Price per day is required'),
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
    const spot = await Spot.findByPk(spotId);

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
    res.json(image)
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
       message: "Couldn't find a Spot with the specified id",
        statusCode: 404
    })
}
 try {
     await spot.update(updateSpot);
    res.json({
       id: spot.id,
       ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
       state: spot.state,
         country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt
    });
   } catch (err) {
    res.status(400).json({
      message: "Validation Error",
       statusCode: 400,
       errors: err.errors.map((error) => error.message)
     });
   }
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
    res.json({
      message: "Spot successfully deleted",
      statusCode: 200
    });
  });

module.exports = router;
