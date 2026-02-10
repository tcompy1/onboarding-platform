const express = require("express");
const bodyParser = require("body-parser");

// Import routes
const applicationRoutes = require('./routes/applications');

const app = express();

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({status: "ok"});
});

// Application routes
app.use('/applications', applicationRoutes); // Public endpoint for creating
app.use('/admin/applications', applicationRoutes); // Admin endpoint for viewing

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Export for testing (we'll use this later)
module.exports = app;