'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Jogos', [
      {
        titulo: "Killer 7",
        plataforma: "PC, Gamecube, Playstation 2",
        amigoId: Number(1),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: "Fallout: New Vegas",
        plataforma: "PC, Playstation 3, Xbox 360",
        amigoId: Number(2),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: "Fallout 76",
        plataforma: "PC, Playstation 4, Playstation 5, Xbox One, Xbox Series S, Xbox Series X",
        amigoId: Number(3),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: "Bloodborne",
        plataforma: "Playstation 4 & Playstation 5",
        amigoId: Number(4),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: "Demon's Souls",
        plataforma: "Playstation 3, Playstation 4, Playstation 5",
        amigoId: Number(5),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: "Persona 3 Reload",
        plataforma: "PC, Playstation 4, Playstation 5, Xbox Series S, Xbox Series X, Nintendo Switch 2",
        amigoId: Number(6),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Jogos', null, {});
  }
};
