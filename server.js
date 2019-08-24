// includes
const express = require('express');
const bodyParser = require('body-parser');
const shelljs = require('shelljs');

startServer();

function startServer() {
	console.log('server starting');
	
	const app = express();
	
	app.set('view engine', 'ejs');
	app.set('views', `${__dirname}/src`);
	app.use(bodyParser.urlencoded());

	app.get('/', (req, res) => res.render('index'));
	
	shelljs.cd('src/scripts');
	shelljs.ls().forEach(fileName => {
		console.log(`creating endpoint for ${fileName}`);
		app.get(`/${fileName}`, (req, res) => {
			res.status(200).sendFile(`${__dirname}/src/scripts/${fileName}`);
		});
	});
	
	shelljs.cd('../stylesheets');
	shelljs.ls().forEach(fileName => {
		console.log(`creating endpoint for ${fileName}`);
		app.get(`/${fileName}`, (req, res) => {
			res.status(200).sendFile(`${__dirname}/src/styleSheets/${fileName}`);
		});
	});
	
	const port = 8081;
	
	const server = app.listen(
		port,
		() => console.log(`Server running on port ${port}`));
	
	console.log('server start complete');
}