const mongoose = require('mongoose');

//create book schema

const authorSchema = mongoose.Schema({

    id: Number,
    name: String,
    books: [String]

});


const authorModel = mongoose.model("author",authorSchema);

module.exports = authorModel;