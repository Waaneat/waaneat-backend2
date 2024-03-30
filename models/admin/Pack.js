const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require("../../database/db");


const Pack = sequelize.define('packs', {
    packName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 20], // Limite la longueur du champ entre 1 et 20 caractères
            is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
        },
    },
    packPrice: {
        type: DataTypes.INTEGER,
        require: true,
        allowNull: false,
        validate: {
            isPositiveNumber(value) {
                if (value < 0) {
                    throw new Error('Le prix doit être un nombre positif.');
                }
            },
        }
    },
    promo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isPositiveNumber(value) {
                if (value < 0) {
                    throw new Error('Le prix doit être un nombre positif.');
                }
                if (value > 100) {
                    throw new Error('La promotion ne doit pas dépasser 100.');
                }
            },
        },
    },
},
{
  tableName:"packs"
}
);

(async () => {
  await sequelize.sync();
})();

module.exports = Pack;