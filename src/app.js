const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views locations. 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static dir to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'raihan shaikh',
        
    })
})

app.get('/about',(req, res) => {
    res.render('about', {
        title: 'About You',
        name: 'Raihan Shaikh',
    })
})

app.get('/help',(req, res) => {
    res.render('help', {
        Description: 'My help file',
        title: 'Help',
        name: 'Raihan Shaikh',
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
            geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
                if (error) {
                    return res.send({ error })
                } 
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({error})
                } 
                
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search object' 
        })
    }
    
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'Raihan Shaikh',
        errormessage: 'Help Article not found'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'Raihan Shaikh',
        errormessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
