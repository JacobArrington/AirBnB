const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking,User, Spot, ReviewImage,Review,SpotImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Op} = require('sequelize')
const { application } = require('express');
const router = express.Router();


const validateBooking = [
    check('startDate').exists().notEmpty().isISO8601().withMessage("Start date is required"),
    check('endDate').exists().notEmpty().isISO8601().withMessage("End date is required"),
]

router.get('/current', requireAuth,async (req, res) => {
    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: Spot,
              
               
                
                include: [
                    {
                        model: SpotImage,
                        attributes: [],
                        where: { preview: true }
                    },
                
                ],
  
        attributes: {
                    include: [[sequelize.fn('COALESCE', sequelize.col('Spot.SpotImages.url'), sequelize.literal("'no image preview has been uploaded'")), 'previewImage']],
                    exclude: ['createdAt', 'updatedAt'],
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

router.put('/:id',requireAuth,validateBooking,async(req,res)=>{
    const booking = await Booking.findByPk(req.params.id, {
        include: [{
            model: User,
            attributes: []
        }]
    });
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
        });
    }
    if (booking.userId !== req.user.id) {
        return res.status(401).json({
            message: 'Unauthorized',
            statusCode: 401
        });
    }

    
    if (new Date(req.body.endDate) < new Date()) {
        return res.status(403).json({
            message: "Past bookings can't be modified",
            statusCode: 403
        });
    }

    
    const conflictingBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            endDate: {
                [Op.gte]: req.body.startDate
            },
            startDate: {
                [Op.lte]: req.body.endDate
            },
            id: {
                [Op.not]: booking.id
            }
        }
    });
    if (conflictingBookings.length > 0) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            errors: [
                "Start date conflicts with an existing booking",
                "End date conflicts with an existing booking"
            ]
        });
    }

   
    await booking.update({
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });
  res.status(200).json(booking)
})


router.delete('/:id', requireAuth, async(req,res)=>{
const bookingId = req.params.id
const booking = await Booking.findByPk(bookingId)
 
if(!booking) {
    return res.status(404).json({
        message: "Booking couldn't be found",
        statusCode: 404
    })
 }
 if(booking.userId !==req.user.id && booking.spot.userId !== req.user.id){
    return res.status(403).json({
        message: "Unauthorized to delete this booking",
        statusCode: 403
    })
    
 }
 if(booking.startDate < new Date()){
    return res.status(403).json({
        message: "Bookings that have been started can't be deleted",
        statusCode: 403
    })
    
 }
 await booking.destroy();

 return res.status(200).json({
    message:"Successfully deleted",
    statusCode: 200
 })

})



module.exports = router;
