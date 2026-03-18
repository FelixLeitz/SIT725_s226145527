var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var port = process.env.PORT || 3000;

app.get('/calculate', (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const operation = req.query.operation;

    if (isNaN(a) || isNaN(b)) {
        return res.send("Error: Please provide valid numbers!");
    }

    let result;
    let description;

    switch (operation) {
        case 'add':
            result = a + b;
            description = `The sum of ${a} and ${b} is: ${result}`;
            break;
        case 'subtract':
            result = a - b;
            description = `The difference of ${a} and ${b} is: ${result}`;
            break;
        case 'multiply':
            result = a * b;
            description = `The product of ${a} and ${b} is: ${result}`;
            break;
        case 'divide':
            if (b === 0) return res.send("Error: Cannot divide by zero!");
            result = a / b;
            description = `The result of ${a} divided by ${b} is: ${result}`;
            break;
    }

    res.send(description);
});

app.listen(port, () => {
    console.log("App listening to: " + port);
});