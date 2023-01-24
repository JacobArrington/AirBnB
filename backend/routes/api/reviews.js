const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, ReviewImage,Review,SpotImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


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

module.exports = router;
