'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReviewImages',[{
      reviewId: 1,
      url: 'https://example.com/image1.jpg',
     
  }, {
      reviewId: 1,
      url: 'https://example.com/image2.jpg',
     
  }, {
      reviewId: 2,
      url: 'https://example.com/image3.jpg',
      
  }, {
     reviewId: 2,
     url: 'https://example.com/image2.jpg',
   }, {
    reviewId: 3,
    url: 'https://example.com/image2.jpg',
  }, {
    reviewId: 3,
    url: 'https://example.com/image2.jpg',
  },



], {});
  },
    


  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages',null,{})
  }
};
