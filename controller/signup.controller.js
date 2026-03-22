const User = require('../model/userModel')
const bcrypt = require('bcryptjs');
const upload = require("../middleware/upload");
const jwt = require("jsonwebtoken")


const user = { name: "John Doe", email: "boluwa@gmail.com:", password: "password123" }
const user1 = { name: "John Doe 1", email: "boluwa@gmail11.com:", password: "password222123" }
const user2 = { name: "John Doe 2", email: "boluwa@gmail2222.com:", password: "password1www23" }
const data = [user, user1, user2,]

console.log("Data before loop:", data[0])

data.forEach((item, index) => {
    item.name
    console.log(`Data at index ${index} after loop:`, item)
})

const generateAccountNumber = () => {
    const randomNum = Math.floor(Math.random() * 10000000000)
    return randomNum.toString().padStart(10, '0')
}

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send({ message: "All fields are required" })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(400).send({ message: "Email has been used" })
    }

    generateAccountNumber();


    const accountNumber = generateAccountNumber;

    await User.create({ firstName, lastName, email, password, accountNumber })

    res.status(200).send({ message: "User signed up successfully" })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function greet(name) {
    return 'Hello' + name + "!"
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

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        },
        process.env.JWT_SECRET,
        { expiresIn: "31d" }
    )
    res.status(200).send({ message: "User logged in successfully", token, user: userData })
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

    const UserData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    }

    res.status(200).send({ message: "User updated successfully", user: UserData })
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

const uploadProfileImage = async (req, res) => {
    const id = req.user.id

    if (!id) return res.status(400).json({ message: "ID is required" })

    if (!req.file) return res.status(400).json({ error: "No file received." })

    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ message: "User not found" })

        user.profileImage = req.file.path
        await user.save()

        return res.status(200).json({
            message: "Profile image updated successfully",
            profileImage: user.profileImage
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

const loop = () => {
    let count = 6
    for (let i = 10; i > count; i--) {
        console.log(i)
    }
}

const fetchUser = async (req, res) => {


    const id = req.user.id
    console.log("Received Id:", id)

    if (!id) {
        return res.status(400).send({ message: "ID is required" })
    }
    try {
        const user = await User.findById(id).select("-password")
        if (!user) {
            console.log("User not found")
            return null
        }

        return res.status(200).send({ message: "User fetched successfully", user })


    } catch (error) {
        console.error("Error fetching user:", error)
        return null
    } return user
}

module.exports = { signup, login, loop, updateUser, updatePassword, sleep, greet, uploadProfileImage, fetchUser }