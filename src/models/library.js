const {Schema, model} = require('mongoose')

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    authors: {
        type: String,
        default: "",
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    fileCover: {
        type: String,
        default: "",
    },
    fileName: {
        type: String,
        default: "",        
    },
    counter: {
        type: String,
        default: "",        
    },
})

module.exports = model('Book', bookSchema)
