const axios = require('axios')

module.exports = {
    /**
 * @swagger
 * /v1/user/data:
 *   get:
 *     summary: Get data from public APIs
 *     description: Retrieve data from public APIs. Optionally filter by category and limit the number of results.
 *     tags: [Data]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter data by category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Limit the number of results
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       API:
 *                         type: string
 *                       Description:
 *                         type: string
 *                       Auth:
 *                         type: string
 *                       HTTPS:
 *                         type: boolean
 *                       Cors:
 *                         type: string
 *                       Link:
 *                         type: string
 *                       Category:
 *                         type: string
 *       400:
 *         description: Bad request, invalid parameters
 *       500:
 *         description: Internal server error
 */
    getData: async (req, res) => {
        try {
            const { category, limit } = req.query
            const response = await axios.get('https://api.publicapis.org/entries')

            let filteredData = response?.data?.entries

            if (!category && !limit) {
                return res.status(200).json({
                    success: true,
                    message: "Successfully fetched data",
                    data: filteredData
                });
            }

            if (category) {
                filteredData = response?.data?.entries.filter(n => n.Category === category);
            }

            if (limit) {
                const limitNum = parseInt(limit);
                if (!isNaN(limitNum)) {
                    filteredData = filteredData.slice(0, limitNum);
                }
            }

            if (response.status === 200) {
                return res.status(200).json({
                    success: true,
                    message: "Successfully fetched data",
                    data: filteredData
                });
            } else {
                return res.status(response.status).json({
                    success: false,
                    message: 'Failed to fetch data from the API'
                });
            }

        } catch (error) {
            console.log("Internal Server Error in getting data")
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
}


