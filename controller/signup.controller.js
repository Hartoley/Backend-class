const User = require('../model/userModel')
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send({ message: "All fields are required" })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(400).send({ message: "Email has been used" })
    }

    await User.create({ firstName, lastName, email, password })

    res.status(200).send({ message: "User signed up successfully" })
}

const login = async (req, res) => {
    console.log(
        "Login request received with email:", req.body.email
    )

    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ message: "All fields are required" })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).send({ message: "Email does not exist in Database, kindly crosscheck and signup" })

    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Incorrect password, kindly crosscheck and try again" })
    }
    res.status(200).send({ message: "User logged in successfully" })
}

module.exports = { signup, login }