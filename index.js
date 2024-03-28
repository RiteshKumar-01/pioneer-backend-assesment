const express = require('express')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const cors = require('cors')
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend APIs Assesment',
            version: '1.0.0',
            description: "Pioneer backend assesment apis",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/router/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log(swaggerSpec);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('Server is running...')
})
app.use('/v1/', require('./routes/router'))

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});