import { UsersModel } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import EmailSender from "../helper/EmailSender.js";
import { VerificationTokenModel } from "../models/Tokens.js";

export const signUp = async (req, res) => {
	try {
		const { email, password } = req.body;

		let user = await UsersModel.findOne({ email });
		if (user) {
			return res.json({
				responsecode: "402",
				message: "This email is already registered.",
			});
		}

		user = await new UsersModel({ email, password }).save();
		const token = await new VerificationTokenModel({
			userID: user._id,
			token: jwt.sign({ id: user._id }, process.env.SECRET_KEY),
		}).save();

		const emailURL = `${process.env.CLIENT_URL}/auth/${user._id}/verify/${token.token}`;
		await EmailSender(
			user.email,
			"Email Verification",
			`Hi there, \n You have set ${user.email} as your registered email. Please click the link to verify your email: ` +
				emailURL
		);
		return res.json({
			responsecode: "200",
			message: "Successfully registered.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};
