'use strict';

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const pageSectionsData = [
      { 
        id: 1, 
        pageId: 1, 
        sectionType: 'infoCompany', 
        content: `[
          {"title":"Tên công ty","value":"","key":"name","url":""},
          {"title":"Khẩu hiệu","value":"","key":"slogan","url":""},
          {"title":"Địa chỉ","value":"","key":"address","url":""},
          {"title":"Hotline","value":"","key":"number_phone","url":""},
          {"title":"Email","value":"","key":"email","url":""},
          {"title":"Zalo","value":"","key":"zalo","url":""},
          {"title":"Facebook","value":"","key":"facebook","url":""},
          {"title":"Messenger","value":"","key":"messenger","url":""},
          {"title":"Tiktok","value":"","key":"tiktok","url":""},
          {"title":"Youtube","value":"","key":"youtube","url":""},
          {"title":"Fax","value":"","key":"fax","url":""}
        ]`, 
        createdAt: timestamp, 
        updatedAt: timestamp 
      },
      {
        id: 2,
        pageId: 1,
        sectionType: 'footer',
        content: `[
          {
            "title": "Chính sách đổi trả",
            "value": "",
            "key": "policy",
            "url": ""
          },
          {
            "title": "Chính sách bảo hành",
            "value": "",
            "key": "policy",
            "url": ""
          },
          {
            "title": "Chính sách bảo mật",
            "value": "",
            "key": "policy",
            "url": ""
          },
          {
            "title": "Chính sách thanh toán",
            "value": "",
            "key": "policy",
            "url": ""
          },
          {
            "title": "Chính sách vận chuyển",
            "value": "",
            "key": "policy",
            "url": ""
          },
          {
            "title": "Bản quyền",
            "value": "",
            "key": "copyright",
            "url": ""
          },
          {
            "title": "Bản đồ",
            "value": "",
            "key": "map",
            "url": ""
          }
        ]`,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ];

    await queryInterface.bulkInsert('PageSections', pageSectionsData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PageSections', null, {})
  }
};
