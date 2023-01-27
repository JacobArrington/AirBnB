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
        foreignKey: 'ownerId',
        as: 'Owner',
        
      })
      Spot.hasMany(models.Review,{
        foreignKey: 'spotId',
        onDelete: "cascade",
        hooks: true

      })
      Spot.hasMany(models.SpotImage,{
        foreignKey: 'spotId',
        onDelete: "cascade",
        hooks: true
      })
      Spot.hasMany(models.Booking,{
        foreignKey: 'spotId',
        onDelete: "cascade",
        hooks: true
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
     
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false,
     
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false,
    
    },
    country:{
      type:DataTypes.STRING,
      allowNull:false,
     
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
    
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    price: {
      type:DataTypes.DECIMAL,
      allowNull: false,
     
    },
  }, {
    sequelize,
    modelName: 'Spot',
    
   
  });
  return Spot;
};
