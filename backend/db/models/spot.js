const bcrypt = require('bcryptjs');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    toSafeObject(){
      const {id, ownerId, address, city, state, country,
         lat, lng, name, description, price } = this
      // cotext is the Spot instance
      return {id, ownerId, address, city, state, country,
         lat, lng, name, description, price }
    }
    static associate(models) {
      Spot.belongsTo(models.User,{
        foreignKey: 'ownerId'
      })
      Spot.hasMany(models.Review,{
        foreignKey: 'spotId'
      })
    
    
      
  }
  }
  Spot.init({
    ownerId: {
     type: DataTypes.INTEGER,
    },
    address: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false,
        validate: {
          notEmpty: true
        
      }
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    country:{
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    lat:{
      type:DataTypes.DECIMAL,
      allowNull: false,
      
    },
    lng: {
      type:DataTypes.DECIMAL,
      allowNull: false,
     
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    price: {
      type:DataTypes.DECIMAL,
      allowNull: false,
      validate:{
        min: 1
      }
    },
  }, {
    sequelize,
    modelName: 'Spot',
    
   
  });
  return Spot;
};
