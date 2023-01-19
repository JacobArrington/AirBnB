const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        attributes: {

            include: [[sequelize.fn('COALESCE', sequelize.fn('AVG',
                sequelize.col('Reviews.stars')), 0), 'averageStarRating'],
            [sequelize.col('SpotImages.url'), 'previewImage']],
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
            [sequelize.col('SpotImages.url'), 'previewImage']],


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
            [sequelize.col('SpotImages.url'), 'previewImage']],


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
    res.json({ spot })
})

router.post('/', async (req, res) => {
    try {
        const { name, description, price, address, city, state,
            country, lat, lng, ownerId, previewImage } = req.body;
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
             previewImage
        });
        res.json(spot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;
