const router = require('express').Router();

router.get('*', async (req,res)=>{

    res.render('404');
})
// router.all('*', (req, res) => {
//     res.render('404')
//   })

module.exports = router;