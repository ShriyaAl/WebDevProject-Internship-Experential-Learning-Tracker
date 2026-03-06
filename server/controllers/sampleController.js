// Example controller
exports.getSampleData = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'This is sample data from the controller',
    });
};
