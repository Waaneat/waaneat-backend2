const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require("../../database/db");

const Admin = sequelize.define('admins', {
    username: {
        type: DataTypes.STRING,
        require: true,
        unique:true,
        allowNull: false,
        validate: {
             is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/
         }
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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [7, Infinity], // La longueur doit être au moins 7 caractères
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['admin', 'root']], // Le rôle doit être soit "admin" soit "root"
        },
    },
},
{
  tableName:"admins"
}
);

(async () => {
  await sequelize.sync();
})();

module.exports = Admin;