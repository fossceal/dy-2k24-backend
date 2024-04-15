const express = require("express");

require("dotenv").config({
    path: "./secrets/.env"
});

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


const { connectDatabase } = require("./configs/db");
const userRouter = require("./routes/authentication_route");
const eventsRouter = require("./routes/events_route");
const cartRouter = require("./routes/cart_route");

app.use(cors());

connectDatabase();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v2", userRouter);
app.use("/api/v2", eventsRouter);
app.use("/api/v2", cartRouter);

//expose public folder
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});