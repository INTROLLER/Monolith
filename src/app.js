const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const PORT = 3000;
const HOST = '192.168.1.233';

app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from "public" folder
app.use('/', routes);

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});