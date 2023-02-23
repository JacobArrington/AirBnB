'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User,{
        foreignKey: 'userId'
       
      })
      Booking.belongsTo(models.Spot,{
        foreignKey: 'spotId'
    })
  }
}
  Booking.init({
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    startDate:{
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
    },
    endDate:{
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
    }, 
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
