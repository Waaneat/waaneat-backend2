const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require("../../../database/db");
const { v4: uuidv4 } = require('uuid');

const Restaurant = require('./Restaurant');

const Dish = sequelize.define('dishes', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    dishName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 30], // Limite la longueur du champ entre 1 et 30 caractères
            is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
        },
    },
    dishPrice: {
        type: DataTypes.INTEGER,
        require: true,
        validate: {
            isPositiveNumber(value) {
                if (value < 0) {
                    throw new Error('Le prix doit être un nombre positif.');
                }
            },
        },
    },
    dishDesc:{
        type: DataTypes.STRING,
        require: true,
        defaultValue: "pas de description",
        validate: {
            len: [1, 200], // Limite la longueur du champ entre 1 et 200 caractères
            is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/
        }    
    },
    dishImg:{
        type: DataTypes.STRING,
        require: true
    },
    dishUrl:{
        type: DataTypes.STRING,
        require: true
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        require: true,
        defaultValue:true
    },
    
},
{
  tableName:"dishes"
}
);

Dish.belongsTo(Restaurant, { foreignKey: 'idResto' });

(async () => {
  await sequelize.sync();
})();

module.exports = Dish;