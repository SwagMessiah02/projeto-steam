const PDFDocument = require('pdfkit');
const AmigoService = require('../services/AmigoService.js');
const { Amigo } = require('../models');

class AmigoController {
    constructor () {
        this.amigoService = new AmigoService(Amigo);
    }

    // /amigos
    exibirAmigos = async (req, res) => {
        const amigos = await this.amigoService.getAllAmigos();
        res.render('amigos/index', { amigos });
    }

    // /amigos/novo
    exibirAdicionarAmigos = async (req, res) => {
        res.render('amigos/novo');
    }

    // /amigos/novo
    adicionarAmigos = async (req, res) => {
        const { nome, email } = req.body;
        await this.amigoService.createAmigo({ nome, email });
        res.redirect('/amigos');
    }

    // /amigos/editar/:id
    exibirEditarAmigo = async (req, res) => {
        const amigo = await this.amigoService.getAmigoById(req.params.id);
        if (!amigo) {
            return res.status(404).send('Amigo não encontrado.');
        }
        res.render('amigos/editar', { amigo });
    }

    // /amigos/editar/:id
    editarAmigo = async (req, res) => {
        const { nome, email } = req.body;
        await this.amigoService.updateAmigo(
            { nome, email },
            { where: { id: req.params.id } }
        );
        res.redirect('/amigos');
    }

    // /amigos/excluir/:id
    excluirAmigos = async (req, res) => {
        await this.amigoService.deleteAmigo({ id: req.params.id });
        res.redirect('/amigos');
    }

    // /amigos/json
    exibirJson = async (req, res) => {
        const data = await this.amigoService.getAmigosJson();
        res.status(200).json(data);
    }

    // /amigos/pdf
    gerarPdf = async (req, res) => {
        const amigos = await this.amigoService.getAllAmigos();

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'inline; filename=relatorio-amigos.pdf'
        );

        doc.pipe(res);

        // Título
        doc
            .fontSize(18)
            .text('Relatório de Amigos', { align: 'center' });

        doc.moveDown();

        // Cabeçalho
        doc.fontSize(12);
        doc.text('ID', 50, doc.y, { continued: true });
        doc.text('Nome', 100, doc.y, { continued: true });
        doc.text('Email', 300, doc.y);

        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

        // Dados
        amigos.forEach(a => {
            doc.moveDown(0.5);
            doc.text(String(a.id), 50, doc.y, { continued: true });
            doc.text(a.nome, 100, doc.y, { continued: true });
            doc.text(a.email, 300, doc.y);
        });

        doc.end();
    }
}

module.exports = AmigoController;
