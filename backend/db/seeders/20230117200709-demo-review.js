'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Reviews',[
    {
      userId: 2,
      spotId: 3,
      review: 'This spot is great!',
      stars: 5,
      
     
      },
      {
      userId: 1,
      spotId: 3,
      review: 'This spot is okay.',
      stars: 5,
     
   
      },
      {
      userId: 4,
      spotId: 1,
      review: 'I did not like this spot.',
      stars: 2,
      
   
      },
   ],{})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
