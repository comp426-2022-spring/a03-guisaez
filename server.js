const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Get port from command line
const args = require('minimist')(process.argv.slice(2))
args['port']

const port = args['port'] || 5000

const logging = (req, res, next) => {
    console.log(req.body.number)
    next()
}

const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%', port))
})

app.get('/app/', (req, res) => {
    res.statusCode = 200;
    res.statusMessage = "OK";
    res.writeHead(res.statusCode, { 'Content-Type' : 'text/plain', "Content-Length" : "16"})
    res.end( res.statusCode + " " + res.statusMessage + "\n")
});

app.get('/app/echo/:number', (req, res) => {
    res.status(200).json({ 'message': req.params.number})
})

app.get('/app/flip', (req, res) => {
    res.status(200).json({'flip': coinFlip()})
})

app.get('/app/flips/:number', (req, res) => {
    var output = coinFlips(req.params.number)
    res.status(200).json({'raw' : output, 'summary' : countFlips(output)})
    
})

app.get('/app/flip/call/:call', (req, res) => {
    res.status(200).json(flipACoin(req.params.call))
})

// Query
app.get('/app/echo/', (req, res) => {
    res.status(200).json({'message' : req.query.number})
})

//Body
app.get('/app/echo/', (req, res) => {
    res.status(200).json({'message' : req.body.number})
})

// Create default endpoint 
app.use(function(req, res){ 
    res.status(404).send("404 NOT FOUND \n")
})

// Functions 
function coinFlip() {
    return Math.random() > 0.5 ? ('tails') : ("heads")
}

function coinFlips(flips) {
    var output = []
    for(let i = 0; i < flips; i++) {
        output[i] = coinFlip()
    }

    return output
}

function countFlips(array){
    const head = 'heads'

    var output = {
        tails: 0,
        heads: 0
    }

    for (const index in array) {
        if(array[index] == head){
            output.heads = output.heads + 1
        }
        else{
            output.tails = output.tails + 1
        }
    }

    return output
}

function flipACoin(call) {

    var output = {
      call : call,
      flip : coinFlip(),
    }
  
    if (output.flip == output.call){
      output.result = 'win'
    }
    else {
      output.result = 'lose'
    }
  
    return output
}
  