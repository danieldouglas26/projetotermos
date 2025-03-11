const express = require('express');
const path = require('path');
const app = express();
const routes = require(path.join(__dirname, 'routes/routes'));

// Configuração do EJS (Para as minhas páginas dinâmicas)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos (Pasta public do meu projeto)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas (Defini apenas um arquivo para comandar todas elas)
app.use('/', routes);

// Para os arquivos estáticos (Versão inicial do projeto)
//app.use(express.json());
//app.use(express.static('public'));

module.exports = app;