// const { Sequelize, DataTypes, Model, Op } = require('sequelize');
// const sequelize = require("../../../database/db");

// const User = require('../User');

// const Deliver = sequelize.define('delivers', {
//     companyName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             len: [1, 50], // Limite la longueur du champ entre 1 et 50 caractères
//             is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
//         },
//         defaultValue: "waane",
//     },
//     identityCard: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "neant.jpg",
//         validate: {
//             isImage(value) {
//                 if (!/\.(jpg|jpeg|png)$/i.test(value)) {
//                     throw new Error('Le format de la pièce d\'identité n\'est pas valide. Utilisez un format JPG, JPEG ou PNG.');
//                 }
//             },
//         },
//     },
//     providerType: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "deliver",
//         validate: {
//             isIn: [['deliver']], // La valeur doit être uniquement "deliver"
//         },
//     },
//     isAuthorized: {
//       type: DataTypes.BOOLEAN,
//       require: true,
//       defaultValue:true
//     }
// },
// {
//   tableName:"delivers"
// }
// );

// Deliver.belongsTo(User, { foreignKey: 'idUser' });

// (async () => {
//   await sequelize.sync();
// })();

// module.exports = Deliver;