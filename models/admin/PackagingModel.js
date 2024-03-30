// const { Sequelize, DataTypes, Model, Op } = require('sequelize');

// const sequelize = require("../../database/db");
// const User = require('../users/User');

// const PackagingModel = sequelize.define('packaging_models', {
//     pMName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             len: [1, 30], // Limite la longueur du champ entre 1 et 30 caractères
//             is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
//         },
//     },
//     pMPrice: {
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
//     pMImg: {
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
//     pMDesc: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             len: [1, 200], // Limite la longueur du champ entre 1 et 200 caractères
//             is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
//         },
//     },
// },
// {
//   tableName:"packaging_models"
// }
// );

// (async () => {
//   await sequelize.sync();
// })();

// module.exports = PackagingModel;