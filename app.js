const express = require('express');

// Initialize the app
const app = express();

app.use('/', (req, res) => {
    return res.json({
    data: 'Hello Check'
})
});

module.exports = app;
