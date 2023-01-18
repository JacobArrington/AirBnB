const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot,Review, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get('/', async(req,res)=>{
    const spots = await Spot.findAll({
        attributes: {
            
            include: [[sequelize.fn('COALESCE', sequelize.fn('AVG',
             sequelize.col('Reviews.stars')), 0), 'averageStarRating']],
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
            
        }],
        
        group: ['Spot.id']
       
     })
        res.json({spots})
    
})

module.exports = router;
