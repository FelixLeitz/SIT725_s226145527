# SIT725_s226145527

A collection of web applications built with Node.js and Express for SIT 725 Applied Software Engineering

## Prerequisites

Make sure you have the following installed before running any app:

- [Node.js](https://nodejs.org/)
- npm

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/FelixLeitz/SIT725_s226145527.git
cd SIT725_s226145527
```

### 2. Navigate to an App

```bash
cd task-name
```

### 3. Install Dependencies

```bash
npm install express # Express application 
npm install mongoose # Database
npm install –save-dev mocha chai request # Testing suite
```

### 4. Run the App

```bash
npm run start
```

The app will be running at **http://localhost:3000** by default.

```bash
npm run start:seed
```

Note: Applications that include seeding should include functionality combining starting and seeding. 

## Configuration

PORT=3000

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)