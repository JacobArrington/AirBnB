'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

///** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      options.tableName = 'Users';
      await queryInterface.bulkInsert(options, [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'demo@user.io',
          username: 'Demo-lition',
          hashedPassword: bcrypt.hashSync('password')
        },
        { firstName: 'Jane',
          lastName: 'Doe',
          email: 'user1@user.io',
          username: 'FakeUser1',
          hashedPassword: bcrypt.hashSync('password2')
        },
        { firstName: 'Rando',
          lastName: 'User',
          email: 'user2@user.io',
          username: 'FakeUser2',
          hashedPassword: bcrypt.hashSync('password3')
        },
        { firstName: 'Fake',
          lastName: 'User',
          email: 'user3@user.io',
          username: 'FakeUser3',
          hashedPassword: bcrypt.hashSync('password4')
      },
      { firstName: 'Meta',
        lastName: 'Demo',
        email: 'user4@user.io',
        username: 'MetaUser',
        hashedPassword: bcrypt.hashSync('password5')
    }, 
      ], {});
    
    
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, null, {});
  }
}
