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
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      preview: true
  }, {
      spotId: 2,
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      preview: true
  }, {
      spotId: 3,
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      url: 'https://res.cloudinary.com/dfnqaxcck/image/upload/v1677709321/camping-kyles-landing-scaled_rc1vgl.jpg',
      preview: true
  }], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
  await queryInterface.bulkDelete(options,null,{})
  }
};
