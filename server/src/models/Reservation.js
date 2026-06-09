const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reservation = sequelize.define("Reservation", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
  itemName: { type: DataTypes.STRING(100), allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userName: { type: DataTypes.STRING(50), allowNull: false },
  startTime: { type: DataTypes.DATE, allowNull: false },
  duration: { type: DataTypes.INTEGER, defaultValue: 1 },
  purpose: { type: DataTypes.STRING(200), allowNull: true },
  status: {
    type: DataTypes.ENUM("active", "cancelled", "completed"),
    defaultValue: "active",
  },
}, {
  tableName: "reservations",
  timestamps: true,
});

module.exports = Reservation;
