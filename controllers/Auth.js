import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Users from "../models/Auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import queryString from "query-string";
import axios from "axios";
import { SendEmail } from "./email.js";
import { decrypt, encrypt } from "./encryption.js";

export const signUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  //checking if user already exist
  let user = await Users.findOne({ email });
  console.log(user);
  if (user)
    return res
      .status(400)
      .send({ success: false, error: "user already exists" });
  //checking if password and confirm pasword matches
  if (password !== confirmPassword)
    return res
      .status(400)
      .send({
        success: false,
        error: "Password and confirm password must match",
      });
  //hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //encrypting userinfo
  const encryptedUserInfo = encrypt(
    JSON.stringify({ name, email, password: hashedPassword })
  );
  //sending email
  try {
    SendEmail(
      email,
      "Verification Email",
      `verify now: ${process.env.FRONTEND_URL}/verify?token=${encryptedUserInfo}`
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};
export const verify = async (req, res) => {
  const { encryptedData } = req.body;
  try {
    console.log(JSON.stringify(encryptedData))
    const userInfo = decrypt(encryptedData);
    console.log(userInfo);
    const newUser = new Users(JSON.parse(userInfo));
    //checking if user already exist
  let user = await Users.findOne({ email:newUser.email });
  console.log(user);
  if (user){

    return res
      .status(400)
      .send({ success: false, error: "user already verified please login" });
  }
    const savedUser = await newUser.save();
    console.log(process.env.JWT_SECRET_KEY);
    //creating and sending jwt token
    const token = jwt.sign(savedUser.email, process.env.JWT_SECRET_KEY);
    console.log(token);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Users.findOne({ email });
    // checking if user exist
    if (!user) {
      return res.status(400).send({ success: false, error: "user not found" });
    }
    // cheking if password is correct
    console.log(password);
    console.log(user.password);
    if (await bcrypt.compare(password, user.password)) {
      //generating and sending jwt token
      const token = jwt.sign(email, process.env.JWT_SECRET_KEY);
      console.log(token);
      res.status(200).send({ success: true, token });
    } else {
      return res
        .status(400)
        .send({ success: false, error: "invalid credintial" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};
export const googleAuth = async (req, res) => {
  //get the access and idtoken
  const code = req.body.code;
  const { id_token, access_token } = await getGoggleTokens({
    code,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.GOOGLE_REDIRECT_URL}`,
  });
  //getting user using access and idtoken
  try {
    const user = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    console.log(user.data);

    //checking if user already exist
    const { name, email, picture } = user.data;
    let existing_user = await Users.findOne({ email });
    console.log(existing_user);
    if (!existing_user) {
      //saving user to db
      const newUser = new Users({ name, email, picture });
      const savedUser = await newUser.save();
      //generating and sending jwt token
      const token = jwt.sign(email, process.env.JWT_SECRET_KEY);
      console.log(token);
      return res.status(200).json({ success: true, token });
    } else {
      //generating and sending jwt token
      const token = jwt.sign(email, process.env.JWT_SECRET_KEY);
      console.log(token);
      return res.status(200).json({ success: true, token });
    }
  } catch (error) {
    console.log(error);
  }
};

//extraFunctions
const getGoggleTokens = async ({
  code,
  clientId,
  clientSecret,
  redirectUri,
}) => {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };
  try {
    const response = await axios.post(url, queryString.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return { error };
  }
};
