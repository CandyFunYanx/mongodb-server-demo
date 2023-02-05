module.exports = option => {
  return async (req, res, next) => {
    const token = String(req.headers.authorication || '').split(' ')[1];
    if(!token) {
      return res.status(422).send({
        message: 'no jwt token'
      })
    }
    const jwt = require('jsonwebtoken');
    const tokenData = jwt.verify(token, app.get('secret'));
    if(!tokenData) {
      return res.status(422).send({
        message: '非法无效的jwt token'
      })
    }
    const AdminUser = require('../../models/AdminUser');
    const user = AdminUser.findById(tokenData.id);
    if(!user) {
      return res.status(422).send({
        message: '用户不存在'
      })
    }
    req.user = user;
    next();
  }
}