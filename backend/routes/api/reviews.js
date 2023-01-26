const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, ReviewImage,Review,SpotImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');
const router = express.Router();

// current user reviews 
router.get('/current',requireAuth, async(req,res) =>{
    const reviews = await Review.findAll({
        where:{
            userId: req.user.id
        },
        include:[{
            model: User,
            
        },
        {
            model: Spot,
            
            attributes: [
                'id',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'price',
            //     [sequelize.fn('COALESCE', sequelize.col('SpotImages.url'),
            //     sequelize.literal("'no image preview has been uploaded'")),
            //      'previewImage']
             ],
            // include: [{
            //     model: SpotImage,
               
            //     attributes: [],
            //     required: false,
            //     where: {isPreview: true},
            //     limit: 1
            // }]
        },
        // {
        //     model: ReviewImage,
            
        // }
    ]
    })
    for await(let review of reviews){
        const img = await ReviewImage.findAll({
           where: {
            reviewId: review.dataValues.id 
           } 
        })
        //const img = await ReviewImage.findAll()
        console.log(review.dataValues.Spot )
        const preview = await SpotImage.findOne({
            where: {
                preview: true,
                spotId: review.dataValues.Spot.dataValues.id
            }
        })
        const map = img.map(pic =>{
            const obj ={}
            obj.id = pic.id
            obj.url = pic.url 
            return obj             

        })
        review.dataValues.ReviewImages = map
        review.dataValues.Spot.dataValues.previewImage = preview.dataValues.url
    }
    res.json({reviews})
}) 

 const validateReview =[
    check('review').exists().notEmpty().withMessage("Review text is required"),
    check('stars').exists().isInt({min: 1, max:5}).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
 ]

// all reviews by spot id 

router.get('/spots/:id', async(req,res)=>{
    const spotId = req.params.id
   
    const reviews = await Review.findAll({
        where:{spotId},
       
        include:[
            {
                model: User,
                attributes: ['id','firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id','ownerId','address',
                'city','state','country','lat','lng','name','price']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })
    if(!Spot){
        return res.status(404).json({
            message: "Spot couldn't be found", 
            statusCode: 404
        })
    }
    res.json({reviews})
})


router.post('/spots/:id',  validateReview, requireAuth, async(req,res)=>{
    const spotId = req.params.id
   // const{review,stars} = req.body
    const spot = await Spot.findByPk(spotId)


    if(!spot){
        return res.status(404).json({
            message: "spot couldn't be found",
            statusCode: 404 
        })
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
    const newReview = await Review.create({
        userId: req.user.id,
        spotId: spotId,
        review: req.body.review,
        stars: req.body.stars
    })
    res.status(201).json({
        id: Review.id,
        userId: newReview.userId,
        spotId: newReview.spotId,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt
        });
        res.json(newReview)
   })


 router.post('/:id/images',requireAuth, async(req,res)=>{
    const {url} = req.body
    const reviewId = req.params.id
    const review = await Review.findByPk(reviewId)

    if(!review){
        return res.status(404).json({
            message:"Review couldn't be found",
        })
        
    }
   const count = await ReviewImage.count({where:{reviewId}})
   if(count >= 10){
    return res.status(403).json({
        message:"Maximum number of images for this resource was reached",
        statusCode: 403 
    })
   }
   const img = await ReviewImage.create({
    reviewId: reviewId,
    url
   })
   res.json(img)
 })

 // edit review

 router.put('/:id',requireAuth, validateReview, async(req,res)=>{
    const reviewId = req.params.id
    const review = await Review.findByPk(reviewId)

    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404,
        })
    }
    if(review.userId !== req.user.id){
        return res.status(403).json({
            message: "you are not authorized to edit this review",
            statusCode: 403, 
        })
    }
    const updateReview = await review.update({
        review: req.body.review,
        stars: req.body.stars
    })
    res.json(updateReview)
 })


 router.delete('/:id', requireAuth,)

module.exports = router;
