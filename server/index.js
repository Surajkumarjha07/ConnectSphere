const express = require("express");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const cors = require("cors")
const jwt = require("jsonwebtoken")

app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
    origin: '*', 
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions))

mongoose.connect("mongodb+srv://surajkumarjha771:MongoCompass@cluster0.i20qj.mongodb.net/")
    .then(
        console.log("Databse is conected")
    ).catch(e => {
        console.log(e);
    })

app.get('/', (req, res) => {
    res.send('Hello Mr. Wayne');
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
})

const users = new mongoose.model('users', userSchema)

app.post('/signUp', async (req, res) => {
    const { name, email, password } = req.body;
    let existingUser = await users.findOne({ email });
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    let newUser = new users({ name, email, password: hashedPassword })
    if (name !== "" && email !== "" && password !== "" && !existingUser) {
        await newUser.save();
        res.status(200).json({
            message: "User Created"
        })
    }
    else {
        res.status(400).json({
            message: "User not created"
        })
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let existingUser = await users.findOne({ email });
    let verifiedPassword = await bcrypt.compare(password, existingUser.password);
    if (email && password) {
        if (verifiedPassword) {
            let token = Math.ceil(Math.random() * (70000 - 17000) + 17000) + "ConnectSphereSecurityKey"
            // let token = jwt.sign()
            res.status(200).json({
                message: "User LoggedIn",
                token
            })
        } else {
            res.status(404).json({
                message: "Email or Password is Incorrect!"
            })
        }
    }
    else {
        res.status(400).json({
            message: "Enter all details"
        })
    }
})

app.put('/updateInfo', async (req, res) => {
    const { email, newName, newEmail, newPassword, password } = req.body;
    const user = await users.findOne({ email });
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(newPassword, salt);

    let updatedUser = {
        $set: {
            name: newName,
            email: newEmail,
            password: hashedPassword
        }
    }

    if (newName && newEmail && newPassword && password) {
        if (user) {
            let verifiedPassword = await bcrypt.compare(password, user.password);
            if (verifiedPassword) {
                let result = await users.updateOne(user, updatedUser)
                res.status(200).json({
                    message: "User Updated",
                    result
                })
            }
            else {
                res.status(200).json({
                    message: "Incorrect Password",
                })
            }
        }
        else {
            res.status(404).json({
                message: 'Incorrect email'
            })
        }
    }
    else {
        res.status(400).json({
            message: "Enter all credentials!"
        })
    }
})

app.delete('/deleteUser', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        let user = await users.findOne({ email });
        if (user) {
            let verifiedPassword = await bcrypt.compare(password, user.password);
            if (verifiedPassword) {
                try {
                    let deleted = await users.deleteOne(user);
                    res.status(200).json({
                        message: "User deleted",
                        deleted
                    })
                } catch (error) {
                    console.log(error);
                }
            }
            else {
                res.status(400).json({
                    message: 'Incorrect Password'
                })
            }
        }
        else {
            res.status(404).json({
                message: 'User not found'
            })
        }
    }
    else {
        res.status(400).json({
            message: "Enter all credentials!"
        })
    }
})

app.listen(8000, () => {
    console.log('server is running');
})