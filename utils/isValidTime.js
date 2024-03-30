const isValidTime = (time) => {
    // Regular expression to validate time format (HH:mm)
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

    // Check if the time matches the expected format
    return timeRegex.test(time);
};

// Export the function for use in other modules
module.exports = isValidTime;