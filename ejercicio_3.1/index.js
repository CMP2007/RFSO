const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', (request) => {
    // Retorna el cuerpo de la solicitud como una cadena JSON
    return JSON.stringify(request.body);
});
const customPostFormat = ':method :url :status :response-time ms :body';
app.use(morgan(customPostFormat));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response)=>{
    response.json(persons)
})

app.get(`/info`, (request, response)=>{
  const text = `<p>Phonebook has info for ${persons.length} people </p>`
  const date = `<p> ${new Date()}</p>`
  response.send( text + date )
})

app.get(`/api/persons/:id`, (request, response)=>{
  const id = Number(request.params.id)
  const onePerson = persons.find(people=> people.id == id)
  if (onePerson) {
    console.log(onePerson);
    response.send(onePerson)
  }
  else{response.status(404).end()}
})

app.delete(`/api/persons/:id`, (request, response)=>{
  const id = Number(request.params.id)
  persons = persons.filter(person=> person.id !== id)
  response.sendStatus(204).end()
})


app.post(`/api/persons`, (request, response)=>{
  const content = request.body

  
  if (content.name && content.number) {
    if (!persons.find((person)=>person.name === content.name)) {

      const newPerson = {
        name: content.name, 
        number: content.number,
        id: Math.floor(Math.random() * (100 -1 +1))+1
      }
      persons = persons.concat(newPerson)
      response.send(persons)
    }
    else{
      console.log('nop')
      response.status(400).json({error: 'ya existe un elemento con este nombre'})
    }
  }
  else{response.status(400).json( {error: 'content missing'})}
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`server runnin on port ${PORT}`);
})