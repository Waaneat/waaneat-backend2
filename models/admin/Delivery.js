// const { Sequelize, DataTypes, Model, Op } = require('sequelize');
// const sequelize = require("../database/db");

// const Delivery = sequelize.define('deliveries', {
//     deliName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             len: [1, 30], // Limite la longueur du champ entre 1 et 30 caractères
//             is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
//         },
//     },
//     deliPrice: {
//         type: DataTypes.INTEGER,
//         require: true,
//         allowNull: false,
//         validate: {
//             isPositiveNumber(value) {
//                 if (value < 0) {
//                     throw new Error('Le prix doit être un nombre positif.');
//                 }
//             },
//         }
//     },
//     deliImg: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "neant.jpg",
//         validate: {
//             isImage(value) {
//                 if (!/\.(jpg|jpeg|png)$/i.test(value)) {
//                     throw new Error('Le format de l\'image n\'est pas valide. Utilisez un format JPG, JPEG ou PNG.');
//                 }
//             },
//         },
//     },
// },
// {
//   tableName:"deliveries"
// }
// );

// (async () => {
//   await sequelize.sync();
// })();

// module.exports = Delivery;