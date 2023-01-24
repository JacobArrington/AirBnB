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
            as: 'Spot',
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
        {
            model: ReviewImage,
            
        }
    ]
    })
    for await(let review of reviews){
        console.log(review)
    }
    res.json({reviews})
})

module.exports = router;
