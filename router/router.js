let express = require('express');
let router = express.Router();
let proxy = require('../common/proxy');

router.all(/^\//, proxy());

module.exports = router;