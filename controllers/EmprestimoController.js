const EmprestimoService = require('../services/EmprestimosService.js');
const AmigoService = require('../services/AmigoService.js');
const JogosService = require('../services/JogosService.js');
const { Amigo, Jogo, Emprestimo } = require('../models');
const PDFDocument = require('pdfkit');

class EmprestimoController {
    constructor () {
        this.emprestimoService = new EmprestimoService(Emprestimo);
        this.amigoService = new AmigoService(Amigo);
        this.jogosService = new JogosService(Jogo);
    }

    // /emprestimos
    exibirEmprestimos = async (req, res) => {
        const emprestimos = await this.emprestimoService.getAllEmprestimos();

        res.render('emprestimos/index', { emprestimos });
    }

    // /emprestimos/novo
    exibirCriarEmprestimo = async (req, res) => {
        const jogos = await this.jogosService.getAllJogosOrderedByTitle();
        const amigos = await this.amigoService.getAllAmigosOrderedByName();
        res.render('emprestimos/novo', { jogos, amigos });
    }

    // /emprestimos/novo
    criarEmprestimo = async (req, res) => {
        const { jogoId, amigoId, dataInicio, dataFim } = req.body;
        await this.emprestimoService.createEmprestimo({
            jogoId: Number(jogoId),
            amigoId: Number(amigoId),
            dataInicio,
            dataFim: dataFim || null
        });

        res.redirect('/emprestimos');
    }

    // /emprestimos/excluir/:id
    excluirEmprestimo = async (req, res) => {
        await this.emprestimoService.excluirEmprestimo({ id: req.params.id });
        res.redirect('/emprestimos');
    }

    exibirJson = async (req, res) => {
        const data = await this.emprestimoService.getEmprestimosJson();

        return res.status(200).json(data);
    }

    // /emprestimos/pdf
    gerarPdf = async (req, res) => {
        const emprestimos = await this.emprestimoService.getAllEmprestimos();
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'inline; filename=relatorio-emprestimos.pdf'
        );

        doc.pipe(res);

        // Título
        doc.fontSize(18).text('Relatório de Empréstimos', { align: 'center' });
        doc.moveDown(2);

        let currentY = doc.y;

        // Larguras equilibradas
        const largura = {
            id: 40,
            jogoId: 60,
            amigoId: 70,
            dataInicio: 120,
            dataFim: 120
        };

        // X calculado automaticamente
        const colunas = {
            id: 50,
            jogoId: 50 + largura.id,
            amigoId: 50 + largura.id + largura.jogoId,
            dataInicio: 50 + largura.id + largura.jogoId + largura.amigoId,
            dataFim: 50 + largura.id + largura.jogoId + largura.amigoId + largura.dataInicio
        };

        // Cabeçalho
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('ID', colunas.id, currentY, { width: largura.id });
        doc.text('JogoID', colunas.jogoId, currentY, { width: largura.jogoId });
        doc.text('AmigoID', colunas.amigoId, currentY, { width: largura.amigoId });
        doc.text('Data Início', colunas.dataInicio, currentY, { width: largura.dataInicio });
        doc.text('Data Fim', colunas.dataFim, currentY, { width: largura.dataFim });

        currentY += 18;

        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        currentY += 10;

        // Dados
        doc.font('Helvetica');

        emprestimos.forEach(e => {
            const textos = {
                id: String(e.id),
                jogoId: String(e.jogoId),
                amigoId: String(e.amigoId),
                dataInicio: e.dataInicio,
                dataFim: e.dataFim
            };

            const alturas = {
                id: doc.heightOfString(textos.id, { width: largura.id }),
                jogoId: doc.heightOfString(textos.jogoId, { width: largura.jogoId }),
                amigoId: doc.heightOfString(textos.amigoId, { width: largura.amigoId }),
                dataInicio: doc.heightOfString(textos.dataInicio, { width: largura.dataInicio }),
                dataFim: doc.heightOfString(textos.dataFim, { width: largura.dataFim })
            };

            const alturaLinha = Math.max(...Object.values(alturas));

            doc.text(textos.id, colunas.id, currentY, { width: largura.id });
            doc.text(textos.jogoId, colunas.jogoId, currentY, { width: largura.jogoId });
            doc.text(textos.amigoId, colunas.amigoId, currentY, { width: largura.amigoId });
            doc.text(textos.dataInicio, colunas.dataInicio, currentY, { width: largura.dataInicio });
            doc.text(textos.dataFim, colunas.dataFim, currentY, { width: largura.dataFim });

            currentY += alturaLinha + 8;

            // Quebra de página
            if (currentY > doc.page.height - 50) {
                doc.addPage();
                currentY = 50;
            }
        });

        doc.end();
    }
}

module.exports = EmprestimoController;
