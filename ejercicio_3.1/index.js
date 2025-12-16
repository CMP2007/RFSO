require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
morgan.token('body', (request) => {
    // Retorna el cuerpo de la solicitud como una cadena JSON
    return JSON.stringify(request.body);
});
const customPostFormat = ':method :url :status :response-time ms :body';
app.use(morgan(customPostFormat));
app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(person => {
    response.json(person)
  })
  .catch(error => next(error))
})

app.get(`/info`, (request, response) => {
  Person.find({})
  .then(person => {
    const text = `<p>Phonebook has info for ${person.length} people </p>`
    const date = `<p> ${new Date()}</p>`
    response.send( text + date )
  })
})

app.get(`/api/persons/:id`, (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    response.json(person)
  })
  .catch( error => next(error))
})

app.delete(`/api/persons/:id`, (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(() => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  newPerson.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
  .then(updatePerson => {
    response.json(updatePerson)
  })
  .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === "ValidationError"){
    console.log(error);
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})