'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    metric_id: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {});
  Result.associate = function(models) {
    // associations can be defined here
  };
  return Result;
};