const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require("../../../database/db");
const { v4: uuidv4 } = require('uuid');

const User = require('../User');

const Customer = sequelize.define('customers', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
},
{
  tableName:"customers"
}
);

Customer.belongsTo(User, { foreignKey: 'idUser' });

(async () => {
  await sequelize.sync();
})();

module.exports = Customer;