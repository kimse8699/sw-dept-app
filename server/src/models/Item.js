const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Item = sequelize.define("Item", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  category: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  reservedBy: { type: DataTypes.STRING(50), allowNull: true },
}, {
  tableName: "items",
  timestamps: true,
});

module.exports = Item;
