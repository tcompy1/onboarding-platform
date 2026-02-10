// In-memory storage (temporary - will be replaced with database later)

const applications = [];
let nextId = 1;

// Handler for creating  an application
exports.createApplication = (req, res) => {
    const { firstName, lastName, email } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // Create application object
    const application = {
        id: nextId++,
        firstName,
        lastName,
        email,
        productType: "checking",
        status: "submitted"
    };

    // Store in memory
    applications.push(application);

    // Send response
    res.status(201).json({
        applicationId: application.id,
        status: application.status
    });
};

// Handler for getting all applications
exports.getAllApplications = (req, res) => {
    res.json(applications);
};