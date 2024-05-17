const express = require('express')
const router  =  express.Router()
const library = require('../../models/library')
const fileMulter = require('../../middleware/file')


router.get('/books', (req, res) => {
    const {book} = library.books
    res.json(book)
})

router.get('/books/:id', (req, res) => {
    const {book} = library.books
    const {id} = req.params
    const idx = book.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.json(book[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }

})

router.get('/books/:id/download', (req, res) => {
    
    const {book} = library.books
    const {id} = req.params
    const idx = book.findIndex(el => el.id === id)

    if( idx !== -1) {
        
        res.download(__dirname+'/../public/img/' + id, book[idx].fileName, err=> {
            if (err){
                res.status(404).json();
            }
            })
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }

})

router.post('/books/',
    fileMulter.single('cover-img'),
    (req, res) => {
    
        const {book} = library.books
        const {title, description, authors, favorite, fileCover, fileName} = req.body
        
        let newBook = {}
        if (req.file) {
            newBook = new library.Book(title, description, authors, favorite, fileCover, req.file.originalname, req.file.path, req.file.filename)
        }
        else {
            newBook = new library.Book(title, description, authors, favorite, fileCover, fileName, '')
        }
        book.push(newBook)

        res.status(201)
        res.json(newBook)
})

router.put('/books/:id',
    fileMulter.single('cover-img'),
    (req, res) => {
        
    if (req.file) {
        const {book} = library.books
        const {title, description, authors, favorite, fileCover} = req.body
        const {id}     = req.params
        const fileName = req.file.originalname
        const fileBook  = req.file.filename
        const idx = book.findIndex(el => el.id === id)
        
        if (idx !== -1){
            book[idx] = {
                ...book[idx],
                title,
                description,
                authors,
                favorite,
                fileCover,
                fileName,
                fileBook,
            }

                res.json(book[idx])
        } else {
            res.status(404)
            res.json('404 | страница не найдена')
        }        
    }
    else {
        res.status(500)
        res.json('500 | возникла ошибка, файл не был загружен.')
    }
})

router.delete('/books/:id', (req, res) => {
    const {book} = library.books
    const {id} = req.params
    const idx = book.findIndex(el => el.id === id)
     
    if(idx !== -1){
        book.splice(idx, 1)
        res.json(true)
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})

router.post('/user/login', (req, res) => {
    

    res.status(201)
    res.json({ id: 1, mail: "test@mail.ru" })
})

module.exports = router