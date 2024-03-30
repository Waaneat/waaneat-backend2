const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require("../../database/db");

const User = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 100], // Limite la longueur du champ entre 1 et 100 caractères
            is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
        },
    },
    email: {
        type: DataTypes.STRING,
        require: true,
        unique:true,
        allowNull: false,
        validate: {
            isEmail:true
        }
    },
    tel: {
        type: DataTypes.STRING,
        require: true,
        allowNull:false,
        validate: {
            is: /^[a-zA-Z0-9]+$/
        }
    },
    password: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
        
    },
    adress: {
        type: DataTypes.STRING,
        require: true,
        allowNull: false,
        validate: {
            is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/
        }
    },
    userType: {
        type: DataTypes.STRING,
        allowNull: false,
        require:true,
        validate: {
            isIn: [['deliver', 'customer', 'seller']], // La valeur doit être soit "deliver" soit "customer" soit "seller"
        },
    },

},
{
  tableName:"users"
}
);

(async () => {
  await sequelize.sync();
})();

module.exports = User;