var express = require('express');
var router = express.Router();

const {findAllstudent} = require('../service/studentService')
/* GET users listing. */
router.get('/findAll',async function(req, res, next) { 
  const obj =  req.query;
  const page = obj.page || 1;
  const size = obj.size || 5

  console.log(page,size);
  const value = await findAllstudent(page,size)
  res.send(value);
});

module.exports = router;
