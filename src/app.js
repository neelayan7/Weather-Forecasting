const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath=path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setupp handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather App',
		name: 'Neelayan Sikdar'
	})
})

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Neelayan Sikdar'
	})
})

app.get('/help', (req, res) => {
	res.render('help', {
		helptext: 'Im stuck',
		title: 'Help',
		name: 'Neelayan Sikdar'
	})
})
app.get('/weather', (req, res) => {
	if(!req.query.address)
	{
		return res.send({
			error: 'You must provide an address'
		})
	}
	geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
		if(error)
		{
			return res.send({ error: error})
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if(error)
			{
				return res.send({error: error})
			}
			res.send({
				forecast: forecastData,
				location: location,
				address: req.query.address
			})
		})
	})
})

app.get('/products', (req, res) => {
	if(!req.query.search) 
	{
		return res.send({
			error: 'You must provide a search term'
		})
	}
	console.log(req.query.search)
	res.send({
		products: []
	})

})

app.get('/help/*', (req, res) => {
	res.render('help404', {
		title: '404',
		errorMessage: 'Help article not found',
		name: 'Neelayan Sikdar'
	})
})

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		errorMessage: 'Page not found',
		name: 'Neelayan Sikdar'
	})
})


app.listen(3000, () => {
	console.log('Server is up on port 3000.')
})