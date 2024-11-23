const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
});

const Transaction = sequelize.define('Transaction', {
  transactionExternalId: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  accountExternalIdDebit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountExternalIdCredit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transferTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = { sequelize, Transaction };
