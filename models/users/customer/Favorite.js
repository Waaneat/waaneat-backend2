// const { Sequelize, DataTypes, Model, Op } = require('sequelize');
// const sequelize = require("../../../database/db");

// const Restaurant = require('../seller/Restaurant');
// const Customer = require('./Customer');
// const Dish = require('../seller/Dish');

// const Favorite = sequelize.define('favorites', {
//     type: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             isIn: [['restaurant', 'dish']], // La valeur doit être soit "restaurant" soit "dish"
//         },
//     },
// },
// {
//   tableName:"favorites"
// }
// );

// Favorite.belongsTo(Customer, { foreignKey: 'idCustomer' });
// Favorite.belongsTo(Dish, { foreignKey: 'idDish' });
// Favorite.belongsTo(Restaurant, { foreignKey: 'idResto' });

// (async () => {
//   await sequelize.sync();
// })();

// module.exports = Favorite;