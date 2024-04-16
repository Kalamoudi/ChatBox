// models/Message.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Message = sequelize.define('Message', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'messages', // Name of the table in the database
  timestamps: false // Disable timestamps as 'date' field is used
});

module.exports = Message;
