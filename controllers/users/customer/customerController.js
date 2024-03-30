const jwtGenerator = require("../../../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const User = require("../../../models/users/User");
const { Op } = require("sequelize");
const isValidString = require("../../../utils/isValidString");
const Customer = require("../../../models/users/customer/Customer");
const { NOT_CUSTOMER ,CU_USERNAME_INVALID, CU_TEL_INVALID, CU_PASSWORD_INVALID, CU_ADRESS_INVALID, CU_ALREADY_EXISTS, CU_EMAIL_INVALID, CU_PASSWORD_NOT_RESET } = require("../../../errors/customer-errors/auth");
const { CU_CREATED, CU_UPDATED, CU_DELETED, CU_FETCHED, CU_PASSWORD_RESET } = require("../../../success/customer-success/auth");
const isValidPassword = require("../../../utils/isValidPassword");
const { isValidGmail } = require("../../../utils/isValidIdentifier");

exports.create = async (req, res) => {
    try {
      const { username, email, tel, password, adress } = req.body;
  
      if (!isValidString(username)) {
        throw new Error('Username vide ou invalide');
      }
  
      if (!isValidGmail(email)) {
        throw new Error('Email vide ou invalide');
      }
  
      if (!isValidString(tel)) {
        throw new Error('Telephone vide ou invalide');
      }
  
      if (!isValidPassword(password)) {
        throw new Error('Password vide , invalide ou trop court');
      }
  
      if (!isValidString(adress)) {
        throw new Error('Adresse vide ou invalide');
      }
  
      const userExists = await User.findOne({
        where: {
          [Op.or]: [
            { username: username },
            { email: email }
          ]
        }
      });
  
      if (userExists) {
        throw new Error('Client existe deja');
      }
  
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);
  
      const newUser = await User.create({
        username: username,
        email: email,
        tel: tel,
        password: bcryptPassword,
        adress: adress,
        userType: 'customer'
      });
  
      await Customer.create({
        idUser: newUser.id
      });
  
      jwtGenerator(res, newUser.id);
  
      const customer = await Customer.findOne({
        where: { idUser: newUser.id },
        include: User
      });
      
      if(!customer){
        throw new Error("customer introuvable")
      }

      res.status(200).json({ code: CU_CREATED, callback: customer });

    } catch (error) {
        let statusCode = 500;
        let errorCode = "SERVEUR_000";
        let errorMessage = error.message;
    
        
        if (error.message === 'Username vide ou invalide') {
            statusCode = 400;
            errorCode = CU_USERNAME_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Email vide ou invalide') {
            statusCode = 400;
            errorCode = CU_USERNAME_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Telephone vide ou invalide') {
            statusCode = 400;
            errorCode = CU_TEL_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Password vide , invalide ou trop court') {
            statusCode = 400;
            errorCode = CU_PASSWORD_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Adresse vide ou invalide') {
            statusCode = 400;
            errorCode = CU_ADRESS_INVALID;
            errorMessage = error.message;
        } else if (error.message === 'Client existe deja') {
            statusCode = 409;
            errorCode = CU_ALREADY_EXISTS;
            errorMessage = error.message;
        }
    
        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    
    }
};

exports.update = async (req, res) => {
    try {
      const { username, email, tel, adress } = req.body;
  
      const customer = await Customer.findOne({
        include: [
          {
            model: User,
            where: { id: req.cookies.userId },
          }
        ]
      });
  
      if (!customer || customer.user.userType !== 'customer') {
        throw new Error('Vous n\'etes pas un client');
      }
  
      if (!isValidString(username)) {
        throw new Error('Username vide ou invalide');
      }
  
      if (!isValidGmail(email)) {
        throw new Error('Email vide ou invalide');
      }
  
      if (!isValidString(tel)) {
        throw new Error('Telephone vide ou invalide');
      }
  
      if (!isValidString(adress)) {
        throw new Error('Adresse vide ou invalide');
      }
  
      await User.update(
        {
          username: username,
          email: email,
          tel: tel,
          adress: adress
        },
        {
          where: { id: customer.user.id }
        }
      );
  
      res.status(200).json({ code: CU_UPDATED, callback: 'Client modifié avec success' });
  
    } catch (error) {
      let statusCode = 500;
      let errorCode = "SERVEUR_000";
      let errorMessage = error.message;
  
      if (error.message === 'Vous n\'etes pas un client') {
        statusCode = 403;
        errorCode = NOT_CUSTOMER;
        errorMessage = error.message;
      } else if (error.message === 'Username vide ou invalide') {
        statusCode = 400;
        errorCode = CU_USERNAME_INVALID;
        errorMessage = error.message;
      } else if (error.message === 'Email vide ou invalide') {
        statusCode = 400;
        errorCode = CU_EMAIL_INVALID;
        errorMessage = error.message;
      } else if (error.message === 'Telephone vide ou invalide') {
        statusCode = 400;
        errorCode = CU_TEL_INVALID;
        errorMessage = error.message;
      } else if (error.message === 'Adresse vide ou invalide') {
        statusCode = 400;
        errorCode = CU_ADRESS_INVALID;
        errorMessage = error.message;
      }
  
      res.status(statusCode).json({ code: errorCode, callback: errorMessage });
  
    }
};

exports.delete = async (req, res) => {
    try {
      const customer = await Customer.findOne({
        include: [
          {
            model: User,
            where: { id: req.cookies.userId },
          }
        ]
      });
  
      if (!customer || customer.user.userType !== 'customer') {
        throw new Error('Vous n\'etes pas un client');
      }
  
      await User.destroy({
        where: { id: customer.user.id }
      });
  
      await Customer.destroy({
        where: { id: customer.id }
      });
  
      res.status(200).json({ code: CU_DELETED, callback: 'Customer supprimé avec success' });
  
    } catch (error) {
      let statusCode = 500;
      let errorCode = "SERVEUR_000";
      let errorMessage = error.message;
  
      if (error.message === 'Vous n\'etes pas un client') {
        statusCode = 403;
        errorCode = NOT_CUSTOMER;
        errorMessage = error.message;
      }
  
      res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
  
exports.get = async (req, res) => {
    try {
      const customer = await Customer.findOne({
        include: [
          {
            model: User,
            where: { id: req.cookies.userId },
          }
        ]
      });
  
      if (!customer || customer.user.userType !== 'customer') {
        throw new Error('Vous n\'etes pas un client');
      }
  
      const oneCustomer = await Customer.findOne({
        where: { id: customer.id }
      });
  
      res.status(200).json({ code: CU_FETCHED, callback: oneCustomer });
  
    } catch (error) {
      let statusCode = 500;
      let errorCode = "SERVEUR_000";
      let errorMessage = error.message;
  
      if (error.message === 'Vous n\'etes pas un client') {
        statusCode = 403;
        errorCode = NOT_CUSTOMER;
        errorMessage = error.message;
      }
  
      res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
  
exports.forgetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      if (!isValidGmail(email) || !isValidPassword(newPassword)) {
        throw new Error('Email ou nouveau mot de passe invalide');
      }
  
      const customer = await Customer.findOne({
        include: [
          {
            model: User,
            where: { email: email },
          }
        ]
      });
  
      if (!customer || customer.user.userType !== 'customer') {
        throw new Error('Vous n\'etes pas un client');
      }
  
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(newPassword, salt);
  
      await User.update(
        {
          password: bcryptPassword,
        },
        {
          where: { id: customer.user.id }
        }
      );
      res.status(200).json({ code: CU_PASSWORD_RESET, callback: 'Mot de passe réinitialisé avec succès' });
  
    } catch (error) {
      let statusCode = 500;
      let errorCode = "SERVEUR_000";
      let errorMessage = error.message;
  
      if (error.message === 'Email ou nouveau mot de passe invalide') {
        statusCode = 400;
        errorCode = CU_PASSWORD_NOT_RESET;
        errorMessage = error.message;
      } else if (error.message === 'Vous n\'etes pas un client') {
        statusCode = 403;
        errorCode = NOT_CUSTOMER;
        errorMessage = error.message;
      }
  
      res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
  