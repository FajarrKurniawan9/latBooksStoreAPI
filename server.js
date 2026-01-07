import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/users.route.js";
import booksRoute from "./routes/books.route.js";
import authRoute from "./routes/auth.route.js";
import transactionsRoute from "./routes/transactions.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5863;
app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/books", booksRoute);
app.use("/txn", transactionsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
