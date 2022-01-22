let express = require('express');
let router = express.Router();

let userController =  require("../controllers/userController")


router.get('/user/all', userController.getAllUsers);

router.get('/user/:id', userController.getUserByID)

router.post('/user/add', userController.addUser)

module.exports = router;