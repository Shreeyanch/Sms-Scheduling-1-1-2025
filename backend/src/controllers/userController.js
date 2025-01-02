import userModel from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import bcrypt from "bcrypt";
import messageModel from "../models/messageModel.js";

export default class UserController {
  //User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log(req.body);

      //check empty fields
      if (!email || !password) {
        return res.json({ success: false, message: "All fields are required" });
      }

      //check email
      let user = await userModel.findOne({ email });
      if (!user) {
        return res.json({
          success: false,
          message: "Credentials do not match.",
        });
      }

      // check password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: "Credentials do not match.",
        });
      }

      user = await userModel.findById(user._id).select("-password -otp");

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        userData: user,
        token: generateToken(user._id),
      });
    } catch (error) {
      console.log(error);

      return res.status(500).send(error);
    }
  }

  //Message Scheduling
  async scheduleMessage(req, res) {
    try {
      console.log(req.body);
      const { title, message, dateandtime } = req.body;
      if (!title || !message || !dateandtime) {
        return res.json({ success: false, message: "All fields are required" });
      }
      if (message.length > 100) {
        return res.json({
          success: false,
          message: "Your message should not me more than 100 characters.",
        });
      }
      const messageSchedule = await messageModel.create({
        ...req.body,
        createdBy: req.user,
      });

      console.log(messageSchedule);
      return res.json({
        success: true,
        message: "Message submitted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async fetchMessageHistory(req, res) {
    try {
      const messages = await messageModel.find({ createdBy: req.user });
      return res.json({ success: true, messages });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}
