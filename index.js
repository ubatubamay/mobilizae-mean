const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const mongoose = require('./database');

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin: 'http://localhost:4200'})); // para quando rodar cada servidor separado server e angular

// Interface Angular
app.use(express.static(path.join(__dirname, 'dist/mobilizae')));
app.use('/', express.static(path.join(__dirname, 'dist/mobilizae')));

// Routes
app.use('/api/usuarios', require('./api/routes/usuario.routes'));
app.use('/api/auth', require('./api/routes/autenticacao.routes'));
app.use('/api/campanhas', require('./api/routes/campanha.routes'));
app.use('/api/ajudas', require('./api/routes/ajuda.routes'));

module.exports = app;