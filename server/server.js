const bodyParser = require('body-parser');
const compression = require('compression');
const consign = require('consign');
const database = require('./middlewares/database');
const email = require('./middlewares/email');
const errorHandler = require('./middlewares/errorHandler');
const express = require('express');
const token = require('./middlewares/token');

const app = express();

email.init();
database.init();
database.testConnection();
app.routes = express.Router();
app.token = token;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/', app.routes);

consign({ cwd: 'server' })
    .include('controllers')
    .then('routes')
    .into(app);

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).end();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port ${port} in ${app.get('env')} mode.`);
});
