const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, ReviewImage,Review,SpotImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


router.get('/current', requireAuth, async(req,res)=>{
   const reviews = await Review.findAll({
    where:{userId:req.user.id},
    include:[{
        model: User,
        attributes:['id','firstName','lastName']
    },
    {
        model: Spot,
        attributes:['id', 'ownerId', 'address', 'city', 
        'state', 'country', 'lat', 'lng', 'name', 'price',
        [sequelize.fn('COALESCE',sequelize.col('SpotImages.url'), 
        sequelize.literal("'no image preview has been uploaded'")), 'previewImage']],
        include: [
            {
              model: SpotImage,
              attributes: ['id', 'url'],
              where:{
                Preview: true
              }
            }
          ]
        
        }
        

        
    ,
   
    {
        model: ReviewImage,
        attributes:['id,url']        
    }
    
]
   }) 
   if(!reviews){
    return res.status(404).json({
        message:"reviews not found",
        statusCode: 404
    })
   }
   res.json({reviews})
})

module.exports = router;
