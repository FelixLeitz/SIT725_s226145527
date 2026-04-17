const coffeeService = require('../services/coffeeService');

exports.getRequiredCoffees = (req, res) => {
  const hours = req.query.hours;

  // No hours provided
  if (hours === undefined || hours === '') {
    return res.status(400).json({ error: "hours is required" });
  }

  const parsed = parseInt(hours);

  // Not a number
  if (isNaN(parsed)) {
    return res.status(400).json({ error: "hours must be a number" });
  }

  // Out of range
  if (parsed < 0 || parsed > 24) {
    return res.status(400).json({ error: "hours must be between 0 and 24" });
  }

  const cups = coffeeService.calculateCoffeeRequired(parsed);

  res.status(200).json({
    hoursOfSleep: parsed,
    coffeeCupsRequired: cups
  });
};
