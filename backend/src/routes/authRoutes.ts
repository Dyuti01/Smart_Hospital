import express, { Request, Response } from "express";
import { userAuth } from "../middlewares/auth";
import { validateSignUpData } from "../utils/validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../utils/prismaClient";
import { signUpInput } from "@dyuti_01/smart_clinic";
import { PrismaClient } from "@prisma/client";

export const authRouter = express.Router();

authRouter.post("/signupCheck", async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });

    const { email, password, phone, userType } = req.body;
    if (!phone) {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (user) {
        res.status(409).json({ error: "User with this email already exists!" });
        return;
      }
      res.json({ message: "Go to go for signup." });
      return;
    } else {
      const user = await prisma.user.findUnique({
        where: {
          phone: phone,
        },
      });
      if (user) {
        res
          .status(409)
          .json({ error: "User with this phone number already exists!" });
        return;
      }

      res.json({ message: "Go to go for signup." });
      return;
    }
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    //   const prisma:PrismaClient<{
    //     datasourceUrl: string | undefined;
    // }, never, DefaultArgs> = prismaClient(req, res);

    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    const body = req.body;

    const { success, error } = signUpInput.safeParse(body);
    if (!success) {
      throw new Error(error.message);
    }
    // validate the data
    // validateSignUpData(req);

    // Encrypt the password
    const {
      firstName,
      lastName,
      email,
      password,
      userType,
      role,
      phone,
      authenticateMethod,
    } = req.body;

    if (!email || !password) {
      //   const passwordHash = await bcrypt.hash(password, 11);
      // Creating an instance of the User model
      const already = await prisma.user.findUnique({
        where: {
          phone: phone,
        },
      });
      if (already) {
        await prisma.$disconnect();
        res.status(409).json({ message: "Phone number already exists!" });
        return;
      }
      const user = await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          password: password,
          email: email,
          userType: userType,
          phone: phone,
        },
      });
      if (userType === "Patient") {
        const { bloodType, allergies, chronicConditions } = req.body;
        await prisma.patient.create({
          data: {
            patientId: user.userId,
            bloodType: bloodType,
            allergies: allergies,
            chronicConditions: chronicConditions,
          },
        });
      }
      // else if (role==='doctor' || userType === "Doctor") {
      //   const {
      //     title,
      //     availability,
      //     experience,
      //     doctorId,
      //     about,
      //     bookingFee,
      //     rating,
      //     reviewCount,
      //     education,
      //     certifications,
      //     specializations,
      //     languages,
      //     registration
      //   } = req.body;
      //   await prisma.doctor.create({
      //     data: {
      //       registration:registration,
      //       availability: {},
      //       experience: experience || "",
      //       doctorId: doctorId,
      //       about: about || "",
      //       bookingFee: bookingFee || 150,
      //       rating: rating || 0,
      //       reviewCount: reviewCount,
      //       title: title,
      //       certifications: certifications,
      //       education: education,
      //       languages: languages,
      //       specializations: specializations,
      //     },
      //   });
      // }
    } else {
      const already = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (already) {
        res
          .status(409)
          .json({ message: "User with this email already exists!" });
        return;
      }
      const passwordHash = await bcrypt.hash(password, 11);
      const user = await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          password: passwordHash,
          email: email,
          userType: userType,
          phone: phone,
        },
      });

      if (userType === "Patient") {
        const { bloodType, allergies, chronicConditions } = req.body;
        await prisma.patient.create({
          data: {
            patientId: user.userId,
            bloodType: bloodType,
            allergies: allergies,
            chronicConditions: chronicConditions,
          },
        });
      }
      // else if (userType === "Doctor") {
      //   const {
      //     title,
      //     availability,
      //     experience,
      //     doctorId,
      //     about,
      //     bookingFee,
      //     rating,
      //     reviewCount,
      //     education,
      //     certifications,
      //     specializations,
      //     languages,
      //     registration,
      //     status
      //   } = req.body;
      //   await prisma.doctor.create({
      //     data: {
      //       availability: availability,
      //       experience: experience || "",
      //       doctorId: doctorId,
      //       about: about || "",
      //       registration:registration,
      //       bookingFee: bookingFee || 150,
      //       rating: rating || 0,
      //       reviewCount: reviewCount,
      //       title: title,
      //       certifications: certifications,
      //       education: education,
      //       languages: languages,
      //       specializations: specializations,
      //       status:status||"Active"
      //     },
      //   });
      // }
    }
    await prisma.$disconnect();
    res.json({ status: "User created" });
    return;
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});

authRouter.post("/loginCheck", async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });

    const { email, password, phone, userType } = req.body;
    if (!phone) {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
          userType: userType,
        },
      });
      if (!user) {
        res
          .status(404)
          .json({ error: "Invalid credentials! No such user exists." });
        return;
      }
      res.json({ message: "Go to go for login." });
      return;
    } else {
      const user = await prisma.user.findUnique({
        where: {
          phone: phone,
          userType: userType,
        },
      });
      if (!user) {
        res
          .status(404)
          .json({ error: "Invalid credentials! No such user exists." });
        return;
      }
      await prisma.$disconnect();
      res.json({ message: "Go to go for login." });
      return;
    }
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });

    const { email, password, phone, userType } = req.body;
    if (!phone) {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
          userType: userType,
        },
      });
      if (!user) {
        res
          .status(404)
          .json({ error: "Invalid credentials! No such user exists." });
        return;
      }
      const actualHash = user.password;

      const isPasswordValid = await bcrypt.compare(password, actualHash || "");

      if (isPasswordValid) {
        const secret: string = process.env.JWT_SECRET || "";
        const token = await jwt.sign({ userId: user.userId }, secret, {
          expiresIn: "1h",
        });

        // Add the token to the cookie and send the response back to the user
        // Better use maxAge rather than milliseconds in expires
        res.cookie("token", token, {
          maxAge: 24 * 3600000,
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        res.json({
          message: "Successfully logged in!",
          userId: user.userId,
          user: {
            fullName: user.firstName + " " + user.lastName,
            avatarUrl: user.avatarUrl,
            role: user.userType,
          },
        });
        return;
      } else {
        // res.clearCookie("token", {path: "/login"});
        // res.clearCookie("token", {path: "/"});
        res.status(401).json({ message: "Invalid credentials!" });
        return;
      }
    } else {
      const user = await prisma.user.findUnique({
        where: {
          phone: phone,
          userType: userType,
        },
      });
      if (!user) {
        res
          .status(404)
          .json({ error: "Invalid credentials! No such user exists." });
        return;
      }
      const secret: string = process.env.JWT_SECRET || "";
      const token = await jwt.sign({ userId: user.userId }, secret, {
        expiresIn: "1h",
      });

      // Add the token to the cookie and send the response back to the user
      // Better use maxAge rather than milliseconds in expires
      res.cookie("token", token, {
        maxAge: 24 * 3600000,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.json({
        message: "Successfully logged in!",
        userId: user.userId,
        user: {
          fullName: user.firstName + " " + user.lastName,
          avatarUrl: user.avatarUrl,
          role: user.userType,
        },
      });
      await prisma.$disconnect();
      return;
    }
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    // g(req.originalUrl);

    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ message: "Logout successfully!" });
    return;
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});

authRouter.patch("/forgotPassword", async (req: Request, res: Response) => {
  try {
    const { userEmail, oldPassword, newPassword } = req.body;
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const hash = user.password;

    const isCorrectPassword = await bcrypt.compare(oldPassword, hash || "");

    if (!isCorrectPassword) {
      throw new Error("Invalid credentials!");
    }
    const newHash = await bcrypt.hash(newPassword, 11);

    await prisma.user.update({
      where: {
        userId: user.userId,
      },
      data: { password: newHash },
    });

    res.json({ message: "Your password is changed successfully!" });
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
});

authRouter.get("/loggedCheck", userAuth, (req: Request, res: Response) => {
  try {
    res.json({ userId: req.body.userId, user: req.body.user });
    return;
  } catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
    return;
  }
});
