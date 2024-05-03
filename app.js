const express = require("express");

require("dotenv").config({
    path: "./secrets/.env"
});

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");


const { connectDatabase } = require("./configs/db");
// const userRouter = require("./routes/authentication_route");
// const eventsRouter = require("./routes/events_route");
// const cartRouter = require("./routes/cart_route");
// const InventoryRouter = require("./routes/inventory_route");
const { sendMail } = require("./utils/sendMail");
const proshowRouter = require("./routes/proshow_route");
const { sendProshowTickets } = require("./controllers/proshow_controller");

app.use(cors({
    origin: ["https://server.dakshayanthra.in"],
    credentials: true,
}));

connectDatabase();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/api/v2", userRouter);
// app.use("/api/v2", eventsRouter);
// app.use("/api/v2", cartRouter);
// app.use("/api/v2", InventoryRouter);

app.use("/api/v2", proshowRouter);

//expose public folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

sendProshowTickets();
