import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";

export default class AdminController {
  async registerUser(req, res) {
    try {
      const { email, password, confirm_password } = req.body.newUser;
      console.log(email);

      console.log(req.body);

      if (!email || !password || !confirm_password) {
        return res.json({ success: false, message: "All fields are required" });
      }
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email address" });
      }

      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) {
        return res.json({
          success: false,
          message: "User already exists with this email address",
        });
      }

      if (password === confirm_password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        let newUser = await userModel.create({
          email,
          password: hashedPassword,
        });
        console.log(newUser);
        newUser = await userModel.findById(newUser._id).select("-password");
        console.log(newUser);
        res.status(200).json({
          success: true,
          message: "User Registered Successful",
          userData: newUser,
        });
      } else {
        return res.json({ success: false, message: "Password didn't match" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }

  async fetchUsers(req, res) {
    try {
      // Find all users where role is 'user'
      const users = await userModel.find({ role: "user" });

      // Respond with the list of users
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(400).json({ message: "Error fetching users", error });
    }
  }
}
