
const signup = (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send({ message: "All fields are required" })
    }

    console.log("This is the first name:" + firstName)
    console.log("This is the last name:" + lastName)
    console.log("This is the email:" + email)
    console.log("This is the password:" + password)
    res.status(200).send({ message: "User signed up successfully" })
}

const login = (req, res) => {

}

module.exports = { signup, login }