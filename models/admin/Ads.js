const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require("../database/db");

const Ads = sequelize.define('ads', {
    adsImg: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "neant.jpg",
        validate: {
            isImage(value) {
                if (!/\.(jpg|jpeg|png)$/i.test(value)) {
                    throw new Error('Le format de l\'image n\'est pas valide. Utilisez un format JPG, JPEG ou PNG.');
                }
            },
        },
    },
},
{
  tableName:"ads"
}
);

(async () => {
  await sequelize.sync();
})();

module.exports = Ads;