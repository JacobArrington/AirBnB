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
             // this agg function goes into the review table and avg the stars for each spot
             // COALESCE states if there are no stars use 0 as a place holder 
             // if only one star it will divide the raiting by 1 and return its value automagicly 


             
             
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
