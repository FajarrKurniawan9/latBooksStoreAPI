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
