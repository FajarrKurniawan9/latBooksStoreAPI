import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.books.findMany({
      orderBy: { id: "asc" },
    });

    res
      .status(200)
      .json({ message: "Books Expeled!", total: books.length, datas: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const books = await prisma.books.findUnique({
      where: { id: parseInt(id) },
    });

    if (!books) {
      return res.status(404).json({ message: "Books it's nor here, fellas!" });
    }

    res
      .status(200)
      .json({ message: "Book Expeled as you wish Reader!", data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postNewBooks = async (req, res) => {
  const { name, author, price, quantity, image } = req.body;
  try {
    const existingBooks = await prisma.books.findUnique({
      where: { name: name },
    });

    if (existingBooks) {
      return res.status(409).json({
        message: "Book name existed Blud!",
      });
    }

    const newBooks = await prisma.books.create({
      data: {
        name,
        author,
        price: parseInt(price),
        quantity: parseInt(quantity),
        image,
      },
    });

    res.status(201).json({
      success: true,
      message: "Books added as your desire, Fam",
      data: newBooks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const putUpdateBooks = async (req, res) => {
  const { id } = req.params;
  const { name, author, price, quantity, image } = req.body;
  try {
    const verify = await prisma.books.findUnique({
      where: { id: parseInt(id) },
    });

    if (!verify) {
      res
        .status(400)
        .json({ message: "Ey, there's no such ID like that in here~" });
    }

    const updateBooks = await prisma.books.update({
      where: { id: parseInt(id) },
      data: {
        name: name || books.name,
        author: author || books.author,
        price: price ? parseInt(price) : books.price,
        quantity: quantity ? parseInt(quantity) : books.quantity,
        image: image || books.image,
      },
    });
    res.status(200).json({
      success: true,
      message: `Voila, ID ${id} it's updated!`,
      data: updateBooks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooks = async (req, res) => {
  const { id } = req.params;
  try {
    const verify = await prisma.books.findUnique({
      where: { id: parseInt(id) },
    });

    if (!verify) {
      res.status(404).json({
        success: false,
        message: `There's no such a ${id} like that, isn't?`,
      });
    }

    const delBooksId = await prisma.books.delete({
      where: { id: parseInt(id) },
      data: {
        id: true,
        name: true,
        author: true,
        price: true,
        quantity: true,
        image: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Book erase from the world!",
      data: delBooksId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
