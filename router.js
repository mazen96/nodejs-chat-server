const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send('Back end server is running ...');
});

module.exports = router;