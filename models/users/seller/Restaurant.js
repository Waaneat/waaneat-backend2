const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require("../../../database/db");
const { v4: uuidv4 } = require('uuid');

const Seller = require('./Seller');

const Restaurant = sequelize.define('restaurants', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    restoName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50], // Limite la longueur du champ entre 1 et 50 caractères
            is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
        },
    },
    restoDesc: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pas encore de description",
        validate: {
            len: [1, 300], // Limite la longueur du champ entre 1 et 300 caractères
            is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
        },
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        require: true,
        defaultValue:true
    },
    restoImg: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "neant.jpg",
        validate: {
            isImage(value) {
                if (!/\.(jpg|jpeg|png)$/i.test(value)) {
                    throw new Error('Le format de l\'image n\'est pas valide. Utilisez un format JPG, JPEG ou PNG.');
                }
            },
        },
    },
    hourStart: {
        type: DataTypes.TIME,
        allowNull: false,
    },

    hourEnd: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    
},
{
  tableName:"restaurants"
}
);

Restaurant.belongsTo(Seller, { foreignKey: 'idSeller' });

(async () => {
  await sequelize.sync();
})();

module.exports = Restaurant;