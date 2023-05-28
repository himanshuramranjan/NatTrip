const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env'});

// Define DB connection URI String
const DB = process.env.DATABASE.replace(
    '<password>', 
    process.env.PASSWORD
);

// Connect to DB
mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con => {
    console.log('Connected with MongoDB');
});

// Define PORT
const PORT = process.env.PORT || 8080;

// Running the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on the PORT: ${PORT}`);
});




