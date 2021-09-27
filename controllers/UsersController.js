import fs from "fs";
import _ from "lodash";
import validator from "validator";
import Validator from "validatorjs";
import Users from "../models/Users";
import md5 from "md5";
import HttpError from "http-errors";
import joi from "joi";

class UsersController {


  static index = (req, res, next) => {
    try {
      res.render('users/index');
    } catch (e) {
      next(e)
    }
  }

  static login = (req, res, next) => {
    try {
      const { register } = req.query;
      res.render('users/login', { errors: {}, data: {}, register });
    } catch (e) {
      next(e)
    }
  }
  static registration = (req, res, next) => {
    try {
      res.render('users/registration', { errors: {}, data: {} });
    } catch (e) {
      next(e)
    }
  }
  static registrationPost = (req, res, next) => {
    try {
      const { fName, lName, email } = req.body;
      let { password } = req.body;
      let validation = new Validator(req.body, {
        email: 'required|email',
        fName: 'required|alpha|min:2',
        lName: 'required|alpha|min:2',
        password: 'required|min:6',
      });
      validation.passes();
      const { errors } = validation.errors;
      const existUser = Users.getUser(email);
      if (existUser) {
        errors.email = ['use already registered']
      }

      // const schema = joi.object({
      //   email: joi.string().trim().email().required(),
      //   fName: joi.string().required(),
      //   number: joi.array(joi.string())
      // })

      // const val = schema.validate(req.body);
      // console.log(val)

      password = md5(md5(password) + '_safe');
      console.log(errors)
      if (_.isEmpty(errors)) {
        Users.createUser(email, { fName, lName, password });
        res.redirect('/users/login?register=1')
        return
      }
      res.render('users/registration', { errors, data: req.body });
    } catch (e) {
      next(e)
    }
  }
}

export default UsersController;
