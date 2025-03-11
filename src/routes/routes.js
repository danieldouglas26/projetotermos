const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


// Rota inicial (raiz)
router.get('/', (req, res) => {
  //Redireciona para a rota de gerar o termo
  res.redirect('/gerartermo');
});

// Rota Termos
router.get('/gerartermo', (req, res) => {
  // Dados que serão passados para a view, como teste (Futuramente implementar um login)
  const dados = {
    titulo: 'Bem-vindo!',
    mensagem: 'Esta é a página inicial.'
  };
  // Renderiza a view 'index.ejs' e passa os dados, como teste
  res.render('index', dados);
});

//Meu Json de configurações, que comanda todo o texto do formulário, itens, e por aí vai
router.get('/config', (req, res) => {
  const filePath = path.join(__dirname, '../data/config.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao ler arquivo JSON');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Middleware para rota não encontrada (404) - Eu criei um index que renderiza a página, para n apontar só o erro 404
router.use((req, res, next) => {
  res.status(404).render('404', { titulo: 'Página não encontrada' }); // Renderiza a view 404.ejs
});

module.exports = router;