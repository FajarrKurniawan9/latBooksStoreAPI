import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "tokoAbangJapar";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Validasi input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Fill up the slot, Comrade!",
      });
    }
    // Cek apakah name sudah digunakan
    const existingUser = await prisma.users.findUnique({
      where: { name },
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Change it, it's already existed!",
      });
    }
    // Buat user baru
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: md5(password),
        role,
      },
    });
    res.status(201).json({
      success: true,
      message: "User successfully created!",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createAt: newUser.createAt,
        updateAt: newUser.updateAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Hey? Look at those gap in your input, do it correctly!",
      });
    }

    // Cari user
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email it's not here guys~",
      });
    }

    // Cek password
    if (user.password !== md5(password)) {
      return res.status(401).json({
        success: false,
        message: "Nuh Uh, Password incorect",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      logged: true,
      message: "Login success, have fun!",
      token: token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        auth: false,
        message: "Token's gone!",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        auth: false,
        message: "Noh, fix the format dude...",
      });
    }

    const verifiedUser = jwt.verify(token, SECRET_KEY);

    if (!verifiedUser) {
      return res.status(401).json({
        success: false,
        auth: false,
        message: "It's invalid, you've gotta be jokin right?",
      });
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        auth: false,
        message: "I said it's invalid dude?!",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        auth: false,
        message: "Meh, it's expired, go get new one~",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
