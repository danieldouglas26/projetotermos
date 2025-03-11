require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3333;

//Aberto para todas as redes disponiveis no host (e eu defini a porta 3333)

app.listen({ host: '0.0.0.0', port: 3333 }, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});