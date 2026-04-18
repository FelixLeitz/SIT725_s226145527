const computeBtn = document.getElementById('computeCoffeesBtn')

computeBtn.addEventListener('click', () => {
  const hours = document.getElementById('hoursInput').value;
  const display = document.getElementById('coffeeDisplay');

  fetch(`api/coffee/required?hours=${hours}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        display.innerHTML = `<p>${data.error}</p>`;
      } else {
        let message = '';

        if (data.coffeeCupsRequired === 0) {
          message = "You're well rested! No coffee needed.";
        } else if (data.coffeeCupsRequired <= 4) {
          message = "A light coffee day..";
        } else if (data.coffeeCupsRequired <= 10) {
          message = "Gonna need a few cups...";
        } else {
          message = "MAXIMUM CAFFEINE MODE ACTIVATED!!!";
        }

        display.innerHTML = `
          <h2>Coffee Report</h2>
          <p><strong>Hours of sleep:</strong> ${data.hoursOfSleep}</p>
          <p><strong>Coffees needed:</strong> ${data.coffeeCupsRequired}</p>
          <p><strong>Verdict:</strong> ${message}</p>
        `;
      }
    })
    .catch(err => {
      display.innerHTML = '<p>Something went wrong :(</p>';
      console.error(err);
    });
});
