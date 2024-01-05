const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const patients = require('./routes/patients');
const doctors = require("./routes/doctors");
const insuranceproviders = require("./routes/insuranceproviders");
const auth = require("./routes/auth");

// Load the environment variables from the config file.
dotenv.config({ path: './config/config.env' });

// Connect to the MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logging Middleware
app.use(morgan('dev'));


// app.use(express.urlencoded({ extended: false }));


// File uploading 
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/patients', patients);
app.use('/api/v1/doctors', doctors);
app.use('/api/v1/insuranceproviders', insuranceproviders);
app.use('/api/v1/auth', auth);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`.yellow.bold);
});
