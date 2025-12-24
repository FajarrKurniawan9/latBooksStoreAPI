import { PrismaClient } from "@prisma/client";
import md5 from "md5";

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json({
      message: "Users retrieved successfully",
      total: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const putUpdateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, email, role } = req.body;

  try {
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new name already exists (if changing name)
    if (name && name !== existingUser.name) {
      const nameExists = await prisma.users.findUnique({
        where: { name },
      });
      if (nameExists) {
        return res.status(400).json({ message: "Name already exists" });
      }
    }

    const data = {
      name: name || existingUser.name,
      email: email || existingUser.email,
      role: role || existingUser.role,
    };

    // Only hash password if provided
    if (password) {
      data.password = md5(password);
    }

    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data,
    });

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await prisma.users.delete({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
