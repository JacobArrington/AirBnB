const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, ReviewImage,Review,SpotImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
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

// all reviews by spot id 

router.get('/spots/:id', async(req,res)=>{
    const spotId = req.params.id
   
    const reviews = await Review.findAll({
        where:{spotId},
       
        include:[
            {
                model: User,
                attributes: ['id','firstName', 'id']
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

module.exports = router;
