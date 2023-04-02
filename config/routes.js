const authController  = require('../controllers/authController');
const homeController = require("../controllers/homeController");
const gameController = require("../controllers/gameController");
const errorController = require('../controllers/errorController')

module.exports = (app) =>{
    app.use("/", homeController);
    app.use('/auth', authController);
    app.use('/game', gameController);
    app.use('*', errorController);

}