import userModel from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import bcrypt from "bcrypt";

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
      
      return res.status(400).send(error);
    }
  }
}
