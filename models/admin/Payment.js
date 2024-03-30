const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require("../../database/db");

const Pack = require('./Pack');

const Payment = sequelize.define('payments', {
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value);
            },
            message: "Le format de la date doit être YYYY-MM-DD."
        }
    },
    packType: {
        type: DataTypes.STRING,
        require:true,
        allowNull: false,
        validate: {
            isIn: [['pack1', 'pack2', 'pack3']], // La valeur doit être soit "pack1" soit "pack2" soit "pack3"
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "not validated",
        validate: {
            isIn: [['not validated', 'validated']], // La valeur doit être soit "not validated" soit "validated"
        },
    },
    expiration: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value);
            },
            message: "Le format de la date doit être YYYY-MM-DD."
        }
    }
},
{
  tableName:"payments"
}
);

Payment.belongsTo(Pack, { foreignKey: 'idPack' });

(async () => {
  await sequelize.sync();
})();

module.exports = Payment;