
class JogosService {
    constructor(model) {
        this.Jogo = model;
    }

    createJogo = async (data) => {
        const { titulo, plataforma, amigoId } = data;
        await this.Jogo.create({ titulo, plataforma, amigoId: Number(amigoId) });
    }

    getAllJogos = async () => {
        const jogos = await this.Jogo.findAll({
            include: [{ model: Amigo, as: 'dono' }],
            order: [['id', 'ASC']]
        });

        return jogos;
    }

    getAllJogosOrderedByTitle = async () => {
        const jogos = await this.Jogo.findAll({ order: [['titulo', 'ASC']] });

        return jogos;
    }

    getJogoById = async (data) => {
        const {id} = data;
        const jogo = await this.Jogo.findByPk(id);

        return jogo;
    }

    updateJogo = async (data, id) => {
        const { titulo, plataforma, amigoId } = data;
        await this.Jogo.update({ titulo, plataforma, amigoId: Number(amigoId) }, id);
    }

    deleteJogo = async (data) => {
        const {id} = data;
        await Jogo.destroy({ where: id });
    }
}

module.exports = JogosService;