const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking,User, Spot, ReviewImage,Review,SpotImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
//const spot = require('../../db/models/spot');
const { application } = require('express');
const router = express.Router();


router.get('/current', requireAuth,async (req, res) => {
    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: Spot,
                attributes: ['id', 'name', 'address', 'city', 
                'state', 'country', 'lat', 'lng', 'price'],
                include: [
                    {
                        model: SpotImage,
                        attributes: [],
                        where: { preview: true }
                    }
                ],
                attributes: {
                    include: [[sequelize.fn('COALESCE', sequelize.col('Spot.SpotImages.url'), sequelize.literal("'no image preview has been uploaded'")), 'previewImage']],
                    
                }
            }
        ],
       
    });

    if(!bookings){
        return res.status(404).json({
            message: "No bookings found for current user",
            statusCode: 404,
        });
    }
    res.json({Bookings:bookings });
});
module.exports = router;
