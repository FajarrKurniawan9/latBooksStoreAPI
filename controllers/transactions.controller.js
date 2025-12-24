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
    const itemsWithPrice = [];
    let totalPrice = 0;

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

      const subTotal = books.price * item.quantity;
      totalPrice += subTotal;

      itemsWithPrice.push({
        books_id: item.books_id,
        quantity: item.quantity,
        price: books.price,
        user_id: userId,
      });
    }

    const newOrder = await prisma.order_users_list.create({
      data: {
        customer_name,
        order_type,
        pickup_date,
        orderDetails: {
          create: itemsWithPrice.map((item) => ({
            books_id: item.books_id,
            quantity: item.quantity,
            price: item.price,
            user_id: item.user_id,
          })),
        },
      },
      include: {
        orderDetails: {
          booksId: true,
          userId: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    });

    for (const item of items) {
      await prisma.books.update({
        where: { id: item.books_id },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    res.status(201).json({
      message: "Your order it's here~",
      data: {
        order_id: newOrder.id,
        customer_name: newOrder.customer_name,
        order_type: newOrder.order_type,
        pickup_date: newOrder.pickup_date,
        items: newOrder.orderDetails.map((detail) => ({
          book_name: detail.booksId.name,
          quantity: detail.quantity,
          price_per_unit: detail.price,
          subTotal: detail.price * detail.quantity,
          served_by: detail.userId.name,
        })),
        total_price: totalPrice,
        created_at: newOrder.createAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const existingTransactions = await prisma.order_users_list.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTransactions) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await prisma.order_detail.deleteMany({
      where: { order_id: parseInt(id) },
    });

    const deletedOrder = await prisma.order_users_list.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(200)
      .json({ message: "Your Order Depleted Blud, done.", data: deletedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const putUpdateOrder = async (req, res) => {
  const { id } = req.params;
  const { customer_name, order_type, pickup_date } = req.body;
  try {
    const existingUser = await prisma.order_users_list.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      res.status(404).json({ message: "Uh huh, it doesn't even here?" });
    }

    const updateTransactions = await prisma.order_users_list.update({
      data: {
        customer_name: customer_name || existingUser.customer_name,
        order_type: order_type || existingUser.order_type,
        pickup_date: pickup_date || existingUser.pickup_date,
      },
    });

    res
      .status(200)
      .json({
        message: "Abracadabra, it's updated as you wish!",
        data: updateTransactions,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
