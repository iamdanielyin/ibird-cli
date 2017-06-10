/**
 * 【{{displayName}}】数据模型
 * Created by {{username}} on {{created}}.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义模型结构
const schema = new Schema({
    code: {
        type: String,
        displayName: '编码',
        unique: true,
        required: '编码({PATH})不能为空',
        index: true
    },
    name: {
        type: String,
        displayName: '名称',
        required: '名称({PATH})不能为空'
    },
    remark: {
        type: String,
        displayName: '备注'
    }
});

// 导出模型
module.exports = {
    name: '{{name}}',
    displayName: '{{displayName}}',
    schema
};