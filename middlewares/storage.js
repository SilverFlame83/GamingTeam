const game = require('../services/game')

module.exports = () => (req,res,next)=>{

    req.storage = {
        ...game
    }

    next();
}
