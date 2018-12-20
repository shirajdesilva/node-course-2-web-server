// creating an express server
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// configured with heroku port
const port = process.env.PORT || 3000;
var app = express();

// partials are functions that run
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');

//how to register middleware - keeps track of server working
app.use( (req, res, next)=> {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    // request logger
    console.log(log)
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// middleware for maintenance
// app.use ( (req, res, next) => {
//     res.render('maintenance.hbs');
// })

///localhost:3000/public/help.html'
app.use(express.static(__dirname + '/public'));

// handlebar helpers
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})


var data = {
    name:'Shiraj',
    age: 34,
    likes: [
        'biking',
        'hiking',
        'wildlife photography',
    ]
}

// http request - sending a string from the server to the client that made the request
app.get('/', ( req, res ) => {
    // response.send('<h1>Hello Express!</h1>')
    res.render('home.hbs', {
        pageTitle: `Shiraj's Website Home Page`,
        welcomeMessage: `Welcome to Shiraj's website`,
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
})

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Portfolio',
    });
})

var request_errror_json = {
    code: 400,
    errorMessage: 'Error handling request',
}

// /bad simulates bad request - response.send - send back json with errorMessage 'Error handling request'
app.get('/bad', (req, res) => {
    res.send(request_errror_json);
})

// binds the app to a port; specifying port 3000
app.listen(port, () => {
    console.log(`Server is up on port:${port}`)
});