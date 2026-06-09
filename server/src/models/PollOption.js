const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PollOption = sequelize.define("PollOption", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pollId: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.STRING(200), allowNull: false },
  votes: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "poll_options",
  timestamps: false,
});

module.exports = PollOption;
