// includes
const express = require('express');
const bodyParser = require('body-parser');

startServer();

function startServer() {
	console.log('server starting');
	
	const app = express();
	
	app.set('view engine', 'ejs');
	app.set('views', `${__dirname}/src`);
	app.use(bodyParser.urlencoded());

	app.get('/', (req, res) => res.render('index'));
	app.get('/game.js', (req, res) => {
		res.status(200).sendFile(`${__dirname}/src/game.js`);
	});
	
	const port = 8081;
	
	const server = app.listen(
		port,
		() => console.log(`Server running on port ${port}`));
	
	console.log('server start complete');
}