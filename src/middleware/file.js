const { v4: uuid } = require('uuid')
const multer = require('multer')
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './src/public/img')
    },
    filename(req, file, cb) {
        let fileName = uuid()
        const {id}     = req.params
        if (id !== undefined) {
            fileName = id
        }
        cb(null, fileName)
    }
})

module.exports = multer({storage})