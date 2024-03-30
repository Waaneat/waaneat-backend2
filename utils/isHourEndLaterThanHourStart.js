const isHourEndLaterThanStart = (hourStart, hourEnd) => {
    const format = 'HH:mm'; // Adjust the format if needed
    const startDate = new Date(`2000-01-01 ${hourStart}`);
    const endDate = new Date(`2000-01-01 ${hourEnd}`);
    
    // Check if endDate is later than startDate
    return endDate > startDate;
};

module.exports = isHourEndLaterThanStart;