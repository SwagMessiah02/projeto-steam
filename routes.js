const express = require('express');
const AmigoController = require('./controllers/AmigoController');
const JogosController = require('./controllers/JogosController');
const EmprestimoController = require('./controllers/EmprestimoController');
const UsuarioController = require('./controllers/UsuarioController');
const customJwtMiddleware = require('./middlewares/customJwtMiddleware');

const router = express.Router();

const amigoController = new AmigoController();
const jogosController = new JogosController();
const emprestimoController = new EmprestimoController();
const usuarioController = new UsuarioController();

// Em andamento...
//router.post('/register', usuarioController.registro);
//router.get('/login', usuarioController.login);

router.get('/amigos/pdf', amigoController.gerarPdf);
router.get('/amigos/json', amigoController.exibirJson);
router.get('/jogos/json', jogosController.exibirJson);
router.get('/emprestimos/json', emprestimoController.exibirJson);
router.get('/amigos', amigoController.exibirAmigos);
router.get('/amigos/pdf', amigoController.gerarPdf);
router.get('/amigos/novo', amigoController.exibirAdicionarAmigos);
router.get('/amigos/editar/:id', amigoController.exibirEditarAmigo);
router.post('/amigos/novo', amigoController.adicionarAmigos);
router.post('/amigos/editar/:id', amigoController.editarAmigo);
router.post('/amigos/excluir/:id', amigoController.excluirAmigos);
router.get('/jogos', jogosController.exibirJogos);
router.get('/jogos/novo', jogosController.exibirListaDeAmigos);
router.get('/jogos/editar/:id', jogosController.exibirEditarJogo);
router.post('/jogos/novo', jogosController.adicionarJogo);
router.post('/jogos/editar/:id', jogosController.editarJogo);
router.post('/jogos/excluir/:id', jogosController.excluirJogo);
router.get('/emprestimos', emprestimoController.exibirEmprestimos);
router.get('/emprestimos/novo', emprestimoController.exibirCriarEmprestimo);
router.post('/emprestimos/novo', emprestimoController.criarEmprestimo);
router.post('/emprestimos/excluir/:id', emprestimoController.excluirEmprestimo);

module.exports = router;
