const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

require('dotenv').config();

const HOST = process.env.HOST;
const PORT = process.env.PORT

console.log(HOST, PORT);

app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from "public" folder
app.use('/', routes);

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});