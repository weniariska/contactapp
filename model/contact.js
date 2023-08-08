const mongoose = require('mongoose')

// Membuat schema (sebuah blueprint) yang pada mongodb akan menjadi collection dengan nama contacts
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true, 
    },
})

module.exports = Contact