const express = require("express");

require("dotenv").config({
    path: "./secrets/.env"
});

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");


const { connectDatabase } = require("./configs/db");
const userRouter = require("./routes/authentication_route");


app.use(cors({
    origin: ["https://dakshayanthra.in", "https://server.dakshayanthra.in", "http://localhost:3000"],
    credentials: true,
    sameSite: "none"
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v2", userRouter);

connectDatabase();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})