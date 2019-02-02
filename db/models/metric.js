'use strict';
module.exports = (sequelize, DataTypes) => {
  const Metric = sequelize.define('Metric', {
    name: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    time: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    higher_is_better: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {});
  Metric.associate = function(models) {
    // associations can be defined here
  };
  return Metric;
};