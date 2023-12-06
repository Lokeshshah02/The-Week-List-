const express = require('express');
const { signUp, logIn, currentUser } = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const { weekList, allWeekList, updateList, deleteWeekList, getWeekListById, deleteWeekListById, deleteWeekListTasksById } = require('../controllers/weekListController');
const isLoggedIn = require('../middleware/validateUser');

const router = express.Router();

router.post('/signup',signUp)

router.post('/login',logIn)

router.get('/current', validateToken, currentUser)

router.post('/weeklist', weekList, isLoggedIn)

router.get("/allweeklist", allWeekList)

router.put('/update', updateList);

router.delete('/delete', deleteWeekList)
router.delete('/deleteweeklisttasks', deleteWeekListTasksById)

router.delete('/getweeklist/:id',getWeekListById)


module.exports = (router);