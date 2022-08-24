import { IncomingForm } from "formidable";
import { genSalt, hash, compare } from "bcrypt";
import { config } from "dotenv";
import { verify, sign } from "jsonwebtoken";
import { userModel } from "../src/Models/User.model";
import { response } from "express";
config();

export class AuthController {
  // Signup method
  signup(request, response) {
    const form = new IncomingForm();

    form.parse(request, async (error, fields, files) => {
      if (error) {
        return response.status(500).json({
          msg: "Network Error: Failed to create account, please try again later",
        });
      }

      const { username, email, password } = fields;
      const salt = await genSalt(15);
      const hashedPassword = await hash(password, salt);
      const newAccount = new userModel({
        username,
        email,
        password: hashedPassword,
      });
      try {
        const savedAccount = await newAccount.save();
        return response
          .status(201)
          .json({ msg: "Account created successfully" });
      } catch (error) {
        // TODO Handle error appropriately
        console.log(error);
        return response.status(500).json({ msg: "Failed to create account" });
      }
    });
  }

  // Signin method
  // TODO Implement better error handling
  signin(request, response) {
    const form = new IncomingForm();

    form.parse(request, async (error, fields, files) => {
      if (error) {
        return response
          .status(500)
          .json({ msg: "Network Error: Failed to loin" });
      }
      const { account, password } = fields;

      // Verify user using email
      const isAccountEmail = account.includes("@");

      if (isAccountEmail) {
        const user = await userModel.findOne({ email: account });

        if (!user) {
          return response
            .status(404)
            .json({ msg: "Account with this email does not exist" });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          return response.status(400).json({ msg: "Invalid Credentials" });
        }
        const token_payload = {
          _id: user._id,
          email: user.email,
          username: user.username,
        };
        const token = sign(token_payload, process.env.coockie_secret, {
          expiresIn: "365d",
        });
        return response.status(200).json({ token });
      }

      // Verify User using username
      const user = await userModel.findOne({ username: account });

      if (!user) {
        return response
          .status(404)
          .json({ msg: "Account with this username does not exist" });
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return response.status(400).json({ msg: "Invalid Credentials" });
      }
      const token_payload = {
        _id: user._id,
        email: user.email,
        username: user.username,
      };
      const token = sign(token_payload, process.env.coockie_secret, {
        expiresIn: "365d",
      });
      return response.status(200).json({ token });
    });
  }

  //Forgot Password method
  forgotPassword(request, response) {
    const form = new IncomingForm();

    form.parse(request, async (error, fields, files) => {
      if (error) {
        return response
          .status(500)
          .json({ msg: "Network Error: Failed to reset password" });
      }
      const { email, password } = fields;

      if (!email || !password) {
        return response
          .status(400)
          .json({ msg: "All fields are required to reset password" });
      }

      const salt = await genSalt(15);
      const hashedPassword = await hash(password, salt);

      try {
        // TODO Handle this process efficiently
        const user = await userModel.findOne({ email: email });
        if (!user) {
          return response
            .status(404)
            .json({ msg: "Account with this email does not exist" });
        }

        const updatedAccount = await userModel.findOneAndUpdate(
          { email: email },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        return response.status(200).json({ msg: "Password reset success" });
      } catch (error) {
        return response.status(500).json({ msg: "Failed to reset password" });
      }
    });
  }
}
