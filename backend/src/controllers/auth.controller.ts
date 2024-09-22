import { Request, Response } from "express";
import primsa from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in the all fields." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password doesn't match" });
    }

    const user = await primsa.user.findUnique({ where: { username } });

    if (user) {
      return res.status(400).json({ error: "username already exists." });
    }

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await primsa.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      generateToken(newUser.id, res);

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
        profile: newUser.profilePic,
      });
    } else {
      return res.status(400).json({
        error: "Invalid data ",
      });
    }
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({
      error: "Internal serverl Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await primsa.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(200).json({
        error: "Invalid credentials.",
      });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(200).json({
        error: "Invalid credentials.",
      });
    }

    generateToken(user.id, res);
    res.status(201).json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      profile: user.profilePic,
    });
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({
      error: "Internal serverl Error",
    });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }).json({
      message: "logged out successfully.",
    });
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({
      error: "Internal serverl Error",
    });
  }
};

export const getme = async(req: Request, res: Response)=>{
  try {
		const user = await primsa.user.findUnique({ where: { id: req.user.id } });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({
			id: user.id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error: any) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}