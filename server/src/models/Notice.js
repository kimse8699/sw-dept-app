const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notice = sequelize.define("Notice", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  type: {
    type: DataTypes.ENUM("필독", "학사", "장학", "일반"),
    allowNull: false,
    defaultValue: "일반",
  },
  createdById: { type: DataTypes.INTEGER, allowNull: false },
  createdByName: { type: DataTypes.STRING(50), allowNull: false },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "notices",
  timestamps: true,
});

module.exports = Notice;
