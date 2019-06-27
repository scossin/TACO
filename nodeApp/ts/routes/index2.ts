const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/', (req: any, res: any) => {
    res.render('login')
});

module.exports = router;
