'use strict';

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const navigationMenusData = [
      { 
        id: 1, 
        title: 'Trang chủ', 
        url: '/', 
        status: 'active',
        position: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: timestamp, 
        updatedAt: timestamp 
      },
      { 
        id: 2, 
        title: 'Giới thiệu', 
        url: '/gioi-thieu', 
        status: 'active',
        position: 2,
        createdBy: 1,
        updatedBy: 1,
        createdAt: timestamp, 
        updatedAt: timestamp 
      },
      { 
        id: 3, 
        title: 'Sản phẩm', 
        url: '/san-pham', 
        status: 'active',
        position: 3,
        createdAt: timestamp, 
        updatedAt: timestamp 
      },
      { 
        id: 4, 
        title: 'Tin tức', 
        url: '/tin-tuc', 
        status: 'active',
        position: 4,
        createdBy: 1,
        updatedBy: 1,
        createdAt: timestamp, 
        updatedAt: timestamp 
      },
      { 
        id: 5, 
        title: 'Liên hệ', 
        url: '/lien-he',   
        status: 'active',
        position: 5,
        createdBy: 1,
        updatedBy: 1,
        createdAt: timestamp, 
        updatedAt: timestamp 
      }
    ];

    await queryInterface.bulkInsert('NavigationMenus', navigationMenusData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('NavigationMenus', null, {})
  }
};
