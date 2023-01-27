'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', [{
      spotId: 1,
      url: 'https://example.com/image1.jpg',
      preview: true
  }, {
      spotId: 2,
      url: 'https://example.com/image2.jpg',
      preview: true
  }, {
      spotId: 3,
      url: 'https://example.com/image3.jpg',
      preview: true
  }], {});
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete(options,null,{})
  }
};
