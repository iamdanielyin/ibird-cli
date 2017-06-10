/**
 * 字段列表
 * Created by yinfxs on 2017/5/8.
 */

export default {
  user: {
    "username": {
      "type": "string",
      "required": true,
      "displayName": "账号",
      "code": "username"
    },
    "password": {
      "type": "string",
      "required": true,
      "displayName": "密码",
      "code": "password"
    },
    "name": {
      "type": "string",
      "required": false,
      "displayName": "昵称",
      "code": "name"
    },
    "avatar": {
      "type": "string",
      "required": false,
      "displayName": "头像",
      "code": "avatar"
    },
    "_id": {
      "displayName": "数据ID",
      "description": "默认生成的ID字段",
      "type": "string",
      "required": true,
      "example": "58ff71aeed56765aff6ea878",
      "code": "_id"
    },
    "__v": {
      "displayName": "版本",
      "description": "默认生成的版本字段",
      "type": "integer",
      "required": true,
      "default": 0,
      "example": 0,
      "code": "__v"
    }
  },
}
