const mongoose = require('mongoose');

const schema = mongoose.Schema({
  username: String,
  password: {
    type: String,
    // 查询用户信息的时候密码不会被查出
    select: false,
    set(val) {
      return require('bcrypt').hashSync(val, 10)
    }
  }
})

module.exports = mongoose.model('User', schema);