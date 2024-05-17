const library = require('./../models/library')
const PORT_REIDS = process.env.PORT_REIDS || 3002
const inversify = require("inversify")
require("reflect-metadata")

class BooksRepository {
  
    //Получает из базы данных список всех книг:
    async getBooks() {
        const books = await library.find()
        //Перенесем список книг в массив который ожидает api counter
        const mBooks = []
        for (let book of books) {
            mBooks.push({id: book._id})
        }

        //Получим просмотры для для каждой книги:
        const url = `http://counter:${PORT_REIDS}/counters`    
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(mBooks)
            })
            let counter = 0
            if (response.ok) {
                const responce  = await response.json()
                //Полученные просмотры находятся в массиве responce.mBooksCounters, перенесем их в массив book:
                for (let bookId of responce.mBooksCounters) {
                    let curBook = books.find(item => item._id == bookId.id)
                    curBook.counter = `Просмотры: ${ +bookId.counter }`
                }
                
            } else {
                console.log("Ошибка HTTP: " + response.status);
            }
        }
        catch {
            let counter = 0
        }
        return books
    }
    
    //Добавлет в базу данных новую книгу:
    async createBook(title, description, authors, favorite, fileCover) {
        const book = new library({
            title, description, authors, favorite, fileCover
        })
        try {
            await book.save();
        } catch (e) {
            console.error(e);
        }
    }
    //Получает книгу из базы данных по айди:
    async getBook(id) {
        let book
        //Получим объект книги:
        try {
            book = await library.findById(id)
        } catch (e) {
            console.error(e)
            res.status(404).redirect('/404')
        }    
        //Получим количество просмотров текущей кники
        const url = `http://counter:${PORT_REIDS}/counter/${id}`
        let counter = 0
        try {        
            let response = await fetch(url, {
                method: 'POST'
            })
            if (response.ok) {
                const responce  = await response.json()
                counter = responce.counter
            } else {
                console.log("Ошибка HTTP: " + response.errmsg);
            }
        }
        catch (e) {     
            console.error(e)
        }
        return {'book': book, 'counter': counter }
    }
    
    //обновляет книгу в базе данных
    async updateBook(id, title, description) {
        
        try {
            await library.findByIdAndUpdate(id, {title, description});
        } catch (e) {
            console.error(e);
        }
    
    }
    //удаляет книгу в базе данных:
    async deleteBook(id) {
        
        try {
            await library.deleteOne({_id: id});
        } catch (e) {
            console.error(e);
        }
    }
}

inversify.decorate(inversify.injectable(), BooksRepository)
const container = new inversify.Container();
container.bind(BooksRepository).toSelf()

module.exports = {container, BooksRepository}
//module.exports = BooksRepository