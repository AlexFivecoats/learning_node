var express = require('express')
var bodyparser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

var dburl = 'mongodb://user:node_2018@ds131313.mlab.com:31313/learning_node'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req,res) =>{
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
})

app.post('/messages', (req,res) =>{
    var message = new Message(req.body)

    message.save((err) => {
        if(err)
            sendStatus(500)

        io.emit('message', req.body)
        res.sendStatus(200)
    })

})

io.on('connection', (socket) => {
    console.log('a user has connected')
})

mongoose.connect(dburl, { useNewUrlParser: true }, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(3000, () => {
    console.log('server is listening on port ', server.address().port)
})