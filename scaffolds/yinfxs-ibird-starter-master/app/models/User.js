/**
 * 【管理员】数据模型
 * Created by yinfxs on 2017/4/18.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义结构
const schema = new Schema({
    username: {
        type: String,
        displayName: '账号',
        unique: true,
        required: '账号({PATH})不能为空',
        index: true
    },
    password: {
        type: String,
        displayName: '密码',
        required: '密码({PATH})不能为空'
    },
    nickname: {
        type: String,
        displayName: '昵称'
    }
});

// 导出对象
module.exports = {
    name: 'User',
    displayName: '管理员',
    schema
};