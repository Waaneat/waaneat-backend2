// const { Sequelize, DataTypes, Model, Op } = require('sequelize');
// const sequelize = require("../database/db");

// const Restaurant = require('./users/seller/Restaurant');
// const Customer = require('./users/customer/Customer');
// const Dish = require('./users/seller/Dish');

// const Star = sequelize.define('stars', {
//     type: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             isIn: [['restaurant', 'dish']], // La valeur doit être soit "restaurant" soit "dish"
//         },
//     },
//     point: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//             isPositiveNumber(value) {
//                 if (value < 0) {
//                     throw new Error('Le nombre doit être un entier positif.');
//                 }
//                 if (value > 5) {
//                     throw new Error('Le nombre ne doit pas dépasser 5.');
//                 }
//             },
//         },
//     },
// },
// {
//   tableName:"stars"
// }
// );

// Star.belongsTo(Customer, { foreignKey: 'idCustomer' });
// Star.belongsTo(Dish, { foreignKey: 'idDish' });
// Star.belongsTo(Restaurant, { foreignKey: 'idResto' });

// (async () => {
//   await sequelize.sync();
// })();

// module.exports = Star;