import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getReportUserHomePage = async (req, res) => {
  const userId = req.users.id;

  const existingUser = await prisma.users.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingUser) {
    res
      .status(404)
      .json({ message: `Uh oh, didn't find user with id ${userId}` });
  }

  const getUser = await prisma.users.findFirst({
    where: {
      id: existingUser.id,
    },
    select: { name: true, email: true, role: true },
    include: {}
  });
};

export const getReportSalesInRange = async (req, res) => {};

export const putUpdateUsersInfo = async (req, res) => {};

export const getReportWishlistsOrOrders = async (req, res) => {};
