function calculateCoffeeRequired(hoursOfSleep) {
    return Math.max(0, (8 - hoursOfSleep) * 2);
};

module.exports = { calculateCoffeeRequired };