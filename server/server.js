const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const app = require('./app');

// Environment variables
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
})
