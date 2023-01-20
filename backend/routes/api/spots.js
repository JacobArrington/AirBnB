const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
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

router.get('/current', async (req, res) => {
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
                [sequelize.fn('COALESCE', sequelize.col('SpotImages.url'),
                sequelize.literal("'no image preview has been uploaded'")),
                 'previewImage'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.id')),'numReviews']],


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
            attributes: ['id','url','preview']

        },
        {
            model:User,
            as:'Owner',
            attributes: ['id','firstName','lastName'],
        }
    ],

        group: ['Spot.id']


    })
    if(!spot){
        return res.status(404).json({
            message:"Spot couldn't be found",
            statusCode: 404
        })
    }
    res.json({ spot })
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

router.post('/',ValidateSpot, async (req, res) => {
    
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
    


module.exports = router;
