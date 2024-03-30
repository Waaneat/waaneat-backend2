// const { Sequelize, DataTypes, Model, Op } = require('sequelize');
// const sequelize = require("../../../database/db");

// const Deliver = require('./Deliver');

// const DeliverSpace = sequelize.define('deliver_spaces', {
//     dsName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             len: [1, 50], // Limite la longueur du champ entre 1 et 50 caractères
//             is: /^[a-zA-Z0-9éè]+( [a-zA-Z0-9éè]+)*$/, // Valide le format du champ
//         },
//         defaultValue: "waane",
//     },
//     isAvailable: {
//         type: DataTypes.BOOLEAN,
//         require: true,
//         defaultValue:true
//     },
//     dsImg: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "img.jpg",
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
//   tableName:"deliver_spaces"
// }
// );

// DeliverSpace.belongsTo(Deliver, { foreignKey: 'idDeliver' });

// (async () => {
//   await sequelize.sync();
// })();

// module.exports = DeliverSpace;