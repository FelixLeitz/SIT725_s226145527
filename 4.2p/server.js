// Define the server and its dependencies
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.port || 3000;

// Sample card data to be served by the API
const sample_cards = [
    {
      title: "Porsche",
      image: "img/porsche.jpg",
      link: "https://www.porsche.com.au/",
      description: "Porsche is a German automobile manufacturer specializing in high-performance sports cars, SUVs and sedans. Founded in 1931 by Ferdinand Porsche in Stuttgart, Germany, the company has built a legendary reputation for engineering excellence and motorsport heritage. Porsche is owned by Volkswagen AG and produces iconic models such as the 911, Cayenne, Macan, Panamera and the all-electric Taycan. With a rich history in motorsport, Porsche holds the record for the most overall wins at the 24 Hours of Le Mans, cementing its status as one of the world's most prestigious automotive brands. The iconic 911, which has been in continuous production since 1963, is widely regarded as one of the greatest sports cars ever made, with its distinctive rear-engine layout and timeless silhouette. Porsche's commitment to innovation is evident in its development of hybrid and electric powertrains, with the Taycan becoming one of the most acclaimed electric vehicles on the market. The brand's motorsport division, Porsche Motorsport, continues to dominate endurance racing and GT competitions around the world, further reinforcing the company's dedication to performance and precision engineering at the highest level."
    },
    {
      title: "BMW",
      image: "img/bmw.jpg",
      link: "https://www.bmw.com.au/",
      description: "BMW, which stands for Bayerische Motoren Werke, is a German multinational manufacturer of luxury vehicles and motorcycles, known for their ultimate driving experience. Founded in 1916 in Munich, Germany, BMW has grown into one of the world's most recognised and respected automotive brands. The company produces a wide range of vehicles including sedans, coupes, convertibles, SUVs and electric vehicles under its BMW, MINI and Rolls-Royce brands. BMW is renowned for its commitment to performance, innovation and sustainability, with an expanding lineup of fully electric i-Series vehicles leading the charge into the future of mobility. The BMW M division, established in 1972, is responsible for producing some of the most thrilling and capable performance vehicles in the world, including the legendary M3, M5 and M8 models. BMW's motorsport heritage is equally impressive, with numerous victories in touring car racing, Formula 1 engine supply and endurance racing. The company has consistently pushed the boundaries of automotive technology, pioneering advances in lightweight construction, driver assistance systems and connected vehicle technology, making BMW one of the most forward-thinking manufacturers in the industry today."
    },
    {
      title: "Mercedes",
      image: "img/mercedes.jpg",
      link: "https://www.mercedes-benz.com.au/",
      description: "Mercedes-Benz is a German luxury automotive brand known for their innovation, comfort and cutting-edge technology. Founded in 1926 and headquartered in Stuttgart, Germany, Mercedes-Benz is one of the oldest and most storied automobile manufacturers in the world. The brand offers an extensive lineup of luxury sedans, SUVs, coupes, convertibles and electric vehicles under its EQ sub-brand. Mercedes-Benz has a proud motorsport heritage, particularly in Formula 1, where it has dominated the sport in recent decades. The brand is synonymous with sophistication, safety innovation and engineering excellence, consistently setting the benchmark for luxury vehicles worldwide. The AMG performance division, founded in 1967, produces some of the most powerful and exclusive road cars available, including the iconic AMG GT and the hyper-exclusive AMG One hypercar which uses a Formula 1 derived powertrain. Mercedes-Benz has been at the forefront of automotive safety innovation for decades, pioneering technologies such as the crumple zone, ABS braking, electronic stability control and a wide range of advanced driver assistance systems. With a bold vision for the future, Mercedes-Benz is investing heavily in electric mobility, autonomous driving technology and sustainable manufacturing, ensuring the brand remains at the pinnacle of the automotive world for generations to come."
    }
];

// Middleware to serve static files and parse JSON and URL-encoded data
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp');
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Define the Card schema for MongoDB
const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 512
  },
  image: {
    type: String,
    required: true,
    maxlength: 512
  },
  link: {
    type: String,
    required: true,
    maxlength: 512
  },
  description: {
    type: String,
    required: true,
    minlength: 128,
    maxlength: 2048
  }
});

// Insert sample data if the collection is empty
const Card = mongoose.model('Card', CardSchema);
Card.countDocuments().then(count => {
  if (count === 0) {
    Card.insertMany(sample_cards)
      .then(() => console.log("Sample data inserted"))
      .catch(err => console.error(err));
  }
});

// API endpoint to retrieve cards from the database
app.get('/api/cards', async (req, res) => {
  const cards = await Card.find({});
  res.json(cards);
});

app.listen(port, () => {
    console.log("App listening to: " + port)
})