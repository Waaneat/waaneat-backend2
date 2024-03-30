const isValidNumeric = (number) => {
    const numericRegex = /^[0-9]+@[0-9]+\.[0-9]+$/;
    return numericRegex.test(number);
}

module.exports = isValidNumeric