const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch(error =>{
    console.log('Error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
        validator: function(v) {
            return /(\d{3}-\d{8})|(\d{2}-\d{7})/.test(v);
        },
        message: props => `El número "${props.value}" no cumple con el formato. Debe usar XXX-XXXXXXXX o XX-XXXXXXX.`,
        required: true
    }
    }
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._i
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)