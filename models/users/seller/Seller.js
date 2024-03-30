const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require("../../../database/db");
const { v4: uuidv4 } = require('uuid');

const User = require('../User');

const Seller = sequelize.define('sellers', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50], // Limite la longueur du champ entre 1 et 50 caractères
            is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
        },
    },
    identityCard: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "neant.jpg",
        validate: {
            isImage(value) {
                if (!/\.(jpg|jpeg|png)$/i.test(value)) {
                    throw new Error('Le format de la pièce d\'identité n\'est pas valide. Utilisez un format JPG, JPEG ou PNG.');
                }
            },
        },
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "seller",
    },
    isAuthorized: {
        type: DataTypes.BOOLEAN,
        require: true,
        defaultValue:false
    }
},
{
  tableName:"sellers"
}
);

Seller.belongsTo(User, { foreignKey: 'idUser' });

(async () => {
  await sequelize.sync();
})();

module.exports = Seller;