'use strict';
const bcrypt = require("bcryptjs");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options,[
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'Knoxville',
        state: 'Tennessee',
        country: 'USA',
        lat: '123.345',
        lng: '-567.789',
        name: 'Spot1',
        description: 'This is the first spot',
        price: 50.00
        },
        {
        ownerId: 3,
        address: '456 Park Ave',
        city: 'Asheville',
        state: 'North Carolina',
        country: 'USA',
        lat: '112.34',
        lng: '-56.78',
        name: 'Spot2',
        description: 'This is the second spot',
        price: 75.00
        },
        {
        ownerId: 5,
        address: '789 Elm St',
        city: 'Charlston',
        state: 'South Carolina',
        country: 'USA',
        lat: '122.34',
        lng: '-456.78',
        name: 'Spot3',
        description: 'This is the third spot',
        price: 100.00
        }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Spot1', 'Spot2', 'Spot3'] }
    }, {});
  }
};
