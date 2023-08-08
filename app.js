// Ecpress JS
const express = require('express')
const app = express()
const port = 3000
app.locals.baseURL = "http://localhost:3000/"
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) 

// EJS layout
const expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(expressLayouts)

// Helper
app.locals.helper = require('./utils/helper')

// Method Override (agar bisa menggunakan routing put dan delete)
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// Express Validator
const { body, validationResult, check } = require('express-validator')

// Flash Message
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
app.use(cookieParser('secret'))
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)
app.use(flash())

// MongoDB
require('./utils/db')
const Contact = require('./model/contact')

// ==============================================================
//                           ROUTING
// ==============================================================
// middleware
app.use((req, res, next) => {
    app.locals.templateData = {
        errors: req.flash('errors'),
        value: req.flash('value'),
        oldValue: req.flash('oldValue'),
        error: req.flash('error'),
        success: req.flash('success'),
    }
    next() // berfungsi agar setelah middleware ini dijalankan maka akan lanjut ke yang lain
})

app.get('/', (req, res) => {
    res.render('index', Object.assign(app.locals.templateData, {
        title: "Halaman Home",
        layout: "layouts/main-layout",
    }))
})

app.get('/about', (req, res) => {
    res.render('about', Object.assign(app.locals.templateData, {
        title: "Halaman About",
        layout: "layouts/main-layout",
    }))
})

app.get('/contact', async (req, res) => {
    const contacts = await Contact.find()
    res.render('contact', Object.assign(app.locals.templateData, {
        title: "Halaman Home",
        layout: "layouts/main-layout",
        contacts: contacts,
    }))
})

app.get('/contact/add', (req, res) => {
    res.render('add-contact', Object.assign(app.locals.templateData, {
        title: "Halaman Tambah Contact",
        layout: "layouts/main-layout",
    }))
})

app.get('/contact/detail/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('detail', Object.assign(app.locals.templateData, {
        title: "Halaman Detail Contact",
        layout: "layouts/main-layout",
        contact: contact,
    }))
})

app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('add-contact', Object.assign(app.locals.templateData, {
        title: "Halaman Detail Contact",
        layout: "layouts/main-layout",
        value: [contact],
    }))
})

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then(result => {
        req.flash('success', `Contact ${req.params.nama} berhasil dihapus`)
        res.redirect('/contact')
    }).catch(err => {
        req.flash('error', `Contact ${req.params.nama} gagal dihapus`)
        res.redirect('/contact')
    })
})

app.post('/contact', [
    check('nama', 'Nama wajib diisi').notEmpty(),
    body('nama').custom(async (value, {req, loc, path}) => {
        if (await Contact.findOne({nama: value})) {
            throw new Error('Nama sudah terdaftar')
        }
        return true // jika tidak duplikat
    }),
    check('email', 'Email wajib diisi').notEmpty(),
    check('email', 'Email tidak valid').isEmail(),
], (req, res) => {
    const oldNama = req.body.oldNama
    delete req.body.oldNama
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('error', 'Gagal, data contact tidak valid')
        req.flash('errors', errors.array())
        req.flash('oldValue', req.body)
        res.redirect('/contact/add')
    } else {
        Contact.insertMany(req.body).then(result => {
            req.flash('success', 'Contact berhasil ditambahkan')
            res.redirect('/contact')
        }).catch(err => {
            req.flash('error', 'Contact gagal ditambahkan')
            res.redirect('/contact')
        })
    }
})

app.put('/contact', [
    check('nama', 'Nama wajib diisi').notEmpty(),
    body('nama').custom(async (value, {req, loc, path}) => {
        if (await Contact.findOne({nama: value}) && value !== req.body.oldNama) {
            throw new Error('Nama sudah terdaftar')
        }
        return true // jika tidak duplikat
    }),
    check('email', 'Email wajib diisi').notEmpty(),
    check('email', 'Email tidak valid').isEmail(),
], (req, res, next) => {
    const oldNama = req.body.oldNama
    delete req.body.oldNama
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('error', 'Gagal, data contact tidak valid')
        req.flash('errors', errors.array())
        req.flash('oldValue', req.body)
        res.redirect('/contact/edit/'+oldNama)
    } else {
        Contact.updateOne(
            { _id: req.body._id }, 
            { $set: {
                nama: req.body.nama, 
                email: req.body.email
            }}
        )
        .then(result => {
            req.flash('success', 'Contact berhasil diedit')
            res.redirect('/contact')
        }).catch(err => {
            req.flash('error', 'Contact gagal diedit')
            res.redirect('/contact')
        })
    }
})

// END ROUTING ==================================================

app.listen(port, () => {
    console.log(`Mongo Contact DB | Listening at http:localhost:${port}`)
})