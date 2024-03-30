const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const routes = require("./routes/index");
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDb = require("./database/connect");
const helmet = require('helmet');
const cookieParser = require("cookie-parser");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Custom-Header, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Autoriser les cookies
    res.setHeader('Access-Control-Expose-Headers', 'Access-Token, Uid');
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Custom-Header, Authorization, Credentials');
      res.status(200).end();
    } else {
      next();
    }
});

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(routes);
app.use(helmet());


connectDb().then(()=>{
    app.listen(PORT,async ()=>{
        // await Commande.update(
        //     {etat: "commande termine",idUserVendeur:2},
        //    { where: {id: 1}}
        // );
        console.log(`server is running at PORT :${PORT}`);
        
    })
})
