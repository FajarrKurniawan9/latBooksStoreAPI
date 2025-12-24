import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllOrder = async (req, res) => {
  try {
    const transactions = await prisma.order_users_list.findMany({
      include: {
        orderDetails: {
          orderId: true,
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Transactions Showed all of it~",
      total: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postCreateOrder = async (req, res) => {
  const { customer_name, order_type, pickup_date, items } = req.body;
  const userId = req.users.id;
  const userRole = req.users.role;

  if (!customer_name || !order_type || !pickup_date || items || items === 0) {
    res.status(400).json({
      message: "customer_name, order_type, pickup_date, and items are required",
    });
  }
  try {
    for (const item of items) {
      const books = await prisma.books.findUnique({
        where: { id: item.books_id },
      });

      if (!books) {
        res.status(404).json({
          message: `Book with id ${item.books_id} not found`,
        });
      }

      if (books.quantity < item.quantity) {
        res.status(400).json({
          message: `Insufficient stock for ${books.name}. Available: ${books.quantity}, Requested: ${item.quantity}`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
