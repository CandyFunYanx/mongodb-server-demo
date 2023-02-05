module.exports = app => {
  const express = require('express');
  const router = express.Router({
    mergeParams: true
  });

  const auth = require('../tools/authMiddleware');

  // 增
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model);
  })

  // 删
  router.delete('/:id', async (req, res) => {
    const result = await req.Model.findByIdAndRemove(req.params.id);
    res.send({
      success: true
    });
  })

  // 改
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  })

  // 查(list)
  router.get('/', async (req, res) => {
    const queryOption = {}
    // if(req.Model.modelName === 'Category') {
    //   queryOption.populate = 'parent'
    // }
    const items = await req.Model.find().setOptions(queryOption).limit(10)
    // const items = await req.Model.find().populate('parent').limit(10)
    // const items = await req.Model.find().limit(10)
    res.send(items)
  })

  // 查(item)
  router.get('/:id', async (req, res) => {
    const item = await req.Model.findById(req.params.id);
    res.send(item)
  })

  app.use('/admin/api/rest/:resource', auth(), async (req, res, next) => {
    const inflection = require('inflection');
    const name = req.params.resource;
    const modelName = inflection.classify(name);
    const Model = require(`../../models/${modelName}`);
    req.Model = Model;
    next();
  }, router);

  // 上传
  const multer = require('multer');
  const upload = multer({
    dest: __dirname + '/../../uploads/admin'
  })
  app.post('/admin/api/upload', auth(), upload.single('file'), async (req, res) => {
    const file = req.file;
    file.url = `http://localhost:7216/uploads/${file.filename}`;
    res.send(file)
  })

  // 登录
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body;
    // 1. 根据用户名查找用户
    const AdminUser = require('../../models/AdminUser');
    const user = await AdminUser.findOne({
      username: username
    }).select('+password')
    if(!user) {
      return res.status(422).send({
        message: '用户不存在'
      })
    }
    // 2. 校验密码
    const bcypt = require('bcrypt');
    const isValid = bcypt.compareSync(password, user.password);
    if(!isValid) {
      return res.status(422).send({
        message: '密码错误'
      })
    }
    // 3. 返回token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({
      id: user._id,
      _id: user._id,
      username: user.username
    }, app.get('secret'))
    res.send({
      username: user.username,
      token
    })
  })
}