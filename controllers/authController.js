const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let users = []

module.exports = {
    /**
     * @swagger
     * /v1/auth/register:
     *   post:
     *     summary: Register a new user
     *     description: Register a new user.
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               DOB:
     *                 type: string
     *               gender:
     *                 type: string
     *               mobileNumber:
     *                 type: string
     *               address:
     *                 type: string
     *     responses:
     *       201:
     *         description: User registered successfully
     *       400:
     *         description: Email already registered
     */
    register: async (req, res) => {
        const { email, password, firstName, lastName, DOB, gender, mobileNumber, address } = req.body

        //need to check the user is already registered or not
        if (users.some(user => user.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = { email, password: hashedPassword, firstName, lastName, DOB, gender, mobileNumber, address };
        users.push(newUser);

        const token = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
            expiresIn: "2d",
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                jwt: token
            }
        });
    },

    /**
     * @swagger
     * /v1/auth/login:
     *   post:
     *     summary: Log in
     *     description: Log in to the system.
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: User logged in successfully
     *       401:
     *         description: Incorrect password
     *       404:
     *         description: User not found
     */
    login: async (req, res) => {
        const { email, password } = req.body;

        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        const token = jwt.sign({ user }, process.env.SECRET_KEY, {
            expiresIn: "2d",
        });

        return res.status(200).json({
            success: true,
            message: 'User Logged In successfully',
            data: {
                jwt: token
            }
        });
    },

    /**
     * @swagger
     * /v1/auth/logout:
     *   post:
     *     summary: Log out
     *     description: Log out from the system.
     *     tags: [Authentication]
     *     responses:
     *       200:
     *         description: Logout successful
     */
    logout: async (req, res) => {

        //we can implement token expiration or delete the token from the databse if used in project
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    }
}
