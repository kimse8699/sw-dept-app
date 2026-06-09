const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Poll = sequelize.define("Poll", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  desc: { type: DataTypes.TEXT, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  deadline: { type: DataTypes.DATE, allowNull: true },
  total: { type: DataTypes.INTEGER, defaultValue: 0 },
  createdById: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "polls",
  timestamps: true,
});

module.exports = Poll;
