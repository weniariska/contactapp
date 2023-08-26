const mongoose = require('mongoose')
// via mongodb local
mongoose.connect('mongodb://127.0.0.1/contactapp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
})

// via mongodb atlas
// mongoose.connect("mongodb+srv://weniariska:we6thofmaymongodb@cluster0.d52dpqy.mongodb.net/contactapp?retryWrites=true&w=majority", 
// {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })

// // Menambah 1 data mengikuti blueprint
// const contact1 = new Contact({
//     nama: "Weni Ariska",
//     email: "weni@gmail.com"
// })

// // Simpan ke collection
// contact1.save().then((contact) => console.log(contact))