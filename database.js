const mongoose = require('mongoose');

const database = 'mobilizae';
const URI = 'mongodb://localhost/' + database;

mongoose.connect(URI, { useNewUrlParser: true })
    .then(db => console.log('MongoDB is connected on ' + database))
    .catch(err => console.error(err));

module.exports = mongoose;