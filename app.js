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

app.use(cors({
    origin: ["https://dakshayanthra.in", "https://server.dakshayanthra.in", "http://localhost:3000", "http://localhost:5500"],
    credentials: true,
    sameSite: "none"
}));

connectDatabase();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v2", userRouter);
app.use("/api/v2", eventsRouter);

//expose public folder
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});