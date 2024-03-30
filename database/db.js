const { Sequelize } = require('sequelize');
const DB_USER=process.env.DB_USER;
const DB_PASSWORD=process.env.DB_PASSWORD;
const DB_HOST=process.env.DB_HOST;
const DB_NAME=process.env.DB_NAME;
require('dotenv').config();

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port:26257,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Désactiver cela dans un environnement de production peut être risqué, veuillez consulter la documentation de CockroachDB sur la gestion des certificats
        },
    },
    define: {
        freezeTableName: true
    }
});

// module.exports = new Sequelize('postgres://localhost:5433/bdd', {
//     dialect: 'postgres',
//     define: {
//         freezeTableName: true
//     }
// });

