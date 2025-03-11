const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give your mongodb password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://beroer:${password}@cluster0.qizik.mongodb.net/bloglistTest?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)
const blog = new Blog({
  title: 'Blog 2',
  author: 'Author 2',
  url: 'www.url2.com',
  likes: 3
})

blog.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})

