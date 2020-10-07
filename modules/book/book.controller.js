const Book = require('./book.model')
const router = Router
exports.get = async (req, res) => {
  const data = await Book.findAll();
  return res.json(data)
}
exports.create = async (req, res) => {
  const data = await Book.create(req.body)
  return res.json(data)
}