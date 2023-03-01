'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    await queryInterface.bulkInsert(options, [{
      spotId: 1,
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677617116/172047_191956997494526_1462028_o_ngaye3.jpg',
      preview: true
  }, {
      spotId: 2,
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677538054/biltmore-house-biltmore-estate-asheville-nc-usa-TR80EC_lmt9um.jpg',
      preview: true
  }, {
      spotId: 3,
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677617127/358-Ralston-Creek_fxge8d.jpg',
      preview: true
  }], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
  await queryInterface.bulkDelete(options,null,{})
  }
};
