import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllOrder = async (req, res) => {
  try {
    const transactions = await prisma.order_users_list.findMany({
        include: {
            orderDetails: {
                
            }
        }
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
