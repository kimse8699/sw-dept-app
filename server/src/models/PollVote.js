const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PollVote = sequelize.define("PollVote", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pollId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  optionId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "poll_votes",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["pollId", "userId"] },
  ],
});

module.exports = PollVote;
