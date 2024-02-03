require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 5000 || process.env.PORT;
const username = process.env.MONGOOB_USERNAME;
const password = process.env.MONGOOB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.dfbmjhx.mongodb.net/registrationFormDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define registration schema and model
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });

        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password,
            });

            await registrationData.save();
            res.redirect("/success");
        } else {
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});
app.get("/success", (req, res)=>{
    res.sendFile(__dirname+"/pages/pages/success.html");
})
app.get("/error", (req, res)=>{
    res.sendFile(__dirname+"/pages/pages/error.html");
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});