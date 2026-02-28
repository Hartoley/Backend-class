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

    const userData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    }
    res.status(200).send({ message: "User logged in successfully", user: userData })
}

const updateUser = async (req, res) => {
    const id = req.params.id
    const { firstName, lastName, email } = req.body

    if (!id) {
        return res.status(400).send({ message: "ID is required" })
    }
    const user = await User.findById(id)
    if (!user) {
        return res.status(400).send({ message: "User does not exist in Database, kindly crosscheck and signup" })
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.email = email || user.email

    await user.save()

    constUserData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    }

    res.status(200).send({ message: "User updated successfully", user: constUserData })
}

const updatePassword = async (req, res) => {
    const id = req.params.id
    const { password } = req.body
    if (!id) {
        return res.status(400).send({ message: "ID is required" })
    }
    if (!password) {
        return res.status(400).send({ message: "Password is required" })
    }
    const user = await User.findById(id)
    if (!user) {
        return res.status(400).send({ message: "User does not exist in Database, kindly crosscheck and signup" })
    }

    user.password = password || user.password

    await user.save()
    res.status(200).send({ message: "Password updated successfully" })

}

const loop = () => {
    let count = 10
    for (let i = 6; i > count; i++) {
        console.log(i)
    }
}

module.exports = { signup, login, loop, updateUser, updatePassword }