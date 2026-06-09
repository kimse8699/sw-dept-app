const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  studentId: { type: DataTypes.STRING(10), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  password: { type: DataTypes.STRING(100), allowNull: false },
  yearId: {
    type: DataTypes.ENUM("y1", "y2", "y3", "y4"),
    allowNull: false,
    defaultValue: "y1",
  },
  yearLabel: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "1학년" },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: "users",
  timestamps: true,
});

module.exports = User;
