const express = require('express')
const router  =  express.Router()
const fileMulter = require('./../middleware/file')
const http = require('http')
const { error } = require('console')
const container = require('./../models/BookRepository').container
const BooksRepository = require('./../models/BookRepository').BooksRepository

router.get('/', async (req, res) => {    

    const repo = container.get(BooksRepository);
    const books = await repo.getBooks()
    res.render('books/index',{
        title: "Books",
        books: books,})   
})

router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Создание книги:",
        book: {},
    })
})

router.post('/create', async (req, res) => {

    const {title, description, authors, favorite, fileCover} = req.body
    const repo = container.get(BooksRepository);
    await repo.createBook(title, description, authors, favorite, fileCover)
    res.redirect('/book')
})

router.get('/:id', async (req, res) => {    

    const {id} = req.params
    const repo = container.get(BooksRepository);
    const result = await repo.getBook(id)
    res.render("books/view", {
        title: "Книга:",
        book: result.book,
        counter: `Количество просмотров: ${+result.counter}`,
    })
})

router.get('/update/:id', async (req, res) => {

    const {id} = req.params
    const repo = container.get(BooksRepository);
    const result = await repo.getBook(id)
    res.render("books/update", {
        title: "Изменение книги:",
        book: result.book,
    })
})

router.post('/update/:id', async (req, res) => {

    const {id} = req.params
    const {title, description, authors, favorite, fileCover} = req.body;
    const repo = container.get(BooksRepository)
    repo.updateBook(id, title, description)
    res.redirect(`/book/${id}`);
})

router.post('/delete/:id', async (req, res) => {

    const {id} = req.params
    const repo = container.get(BooksRepository)
    await repo.deleteBook(id)
    res.redirect(`/book`)
})

module.exports = router