const AmigoService = require('../services/AmigoService.js');
const { Amigo } = require('../models');
const PDFDocument = require('pdfkit');

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

        doc.moveDown(2);

        // Configuração das colunas
        const startX = 50;
        let currentY = doc.y;

        const colunas = {
            id: 50,
            nome: 150,
            email: 250
        };

        const largura = {
            id: 50,
            nome: 200,
            email: 250
        };

        // Cabeçalho
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('ID', colunas.id, currentY, { width: largura.id });
        doc.text('Nome', colunas.nome, currentY, { width: largura.nome });
        doc.text('Email', colunas.email, currentY, { width: largura.email });

        currentY += 20;

        doc.moveTo(startX, currentY)
        .lineTo(550, currentY)
        .stroke();

        currentY += 10;

        // Dados
        doc.font('Helvetica');

        amigos.forEach(a => {
            const idText = String(a.id);
            const nomeText = a.nome;
            const emailText = a.email;

            // Calcula a altura necessária de cada célula
            const alturaId = doc.heightOfString(idText, { width: largura.id });
            const alturaNome = doc.heightOfString(nomeText, { width: largura.nome });
            const alturaEmail = doc.heightOfString(emailText, { width: largura.email });

            // Usa a maior altura da linha
            const alturaLinha = Math.max(alturaId, alturaNome, alturaEmail);

            doc.text(idText, colunas.id, currentY, {
                width: largura.id
            });

            doc.text(nomeText, colunas.nome, currentY, {
                width: largura.nome
            });

            doc.text(emailText, colunas.email, currentY, {
                width: largura.email
            });

            currentY += alturaLinha + 10;

            // Quebra de página automática
            if (currentY > doc.page.height - 50) {
                doc.addPage();
                currentY = 50;
            }
        });

        doc.end();
    }
}

module.exports = AmigoController;
