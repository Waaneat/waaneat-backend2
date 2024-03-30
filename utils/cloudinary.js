const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: "dbrjfsjuk",
    api_key: "818785511188885",
    api_secret: "yDSF81jnm2FS4X2X65k3gRs9GH8"
});

module.exports = cloudinary;

// CLOUD_NAME=dbrjfsjuk
// CLOUD_KEY=818785511188885
// CLOUD_KEY_SECRET=yDSF81jnm2FS4X2X65k3gRs9GH8