'use strict';

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const pagesData = [
      { id: 1, title: 'Trang chủ', slug: 'trang-chu', status: 'active', createdAt: timestamp, updatedAt: timestamp },
      { id: 2, title: 'Giới thiệu', slug: 'gioi-thieu', status: 'active', createdAt: timestamp, updatedAt: timestamp },
      { id: 3, title: 'Sản phẩm', slug: 'san-pham', status: 'active', createdAt: timestamp, updatedAt: timestamp },
      { id: 4, title: 'Tin tức', slug: 'tin-tuc', status: 'active', createdAt: timestamp, updatedAt: timestamp },
      { id: 5, title: 'Liên hệ', slug: 'lien-he', status: 'active', createdAt: timestamp, updatedAt: timestamp },
    ];

    await queryInterface.bulkInsert('Pages', pagesData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pages', null, {})
  }
};
