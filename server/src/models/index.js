const sequelize = require("../config/database");
const User = require("./User");
const Notice = require("./Notice");
const Poll = require("./Poll");
const PollOption = require("./PollOption");
const PollVote = require("./PollVote");
const Item = require("./Item");
const Reservation = require("./Reservation");

// ── Associations ──────────────────────────────────
Poll.hasMany(PollOption, { foreignKey: "pollId", as: "options", onDelete: "CASCADE" });
PollOption.belongsTo(Poll, { foreignKey: "pollId" });

Poll.hasMany(PollVote, { foreignKey: "pollId", onDelete: "CASCADE" });
PollVote.belongsTo(Poll, { foreignKey: "pollId" });
PollVote.belongsTo(User, { foreignKey: "userId" });

Notice.belongsTo(User, { foreignKey: "createdById", as: "author" });

Reservation.belongsTo(Item, { foreignKey: "itemId" });
Reservation.belongsTo(User, { foreignKey: "userId" });

module.exports = { sequelize, User, Notice, Poll, PollOption, PollVote, Item, Reservation };
