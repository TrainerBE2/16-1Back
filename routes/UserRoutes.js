const express = require('express');
const user = require('../controllers/UserController');
const mid = require('../library/Middleware');
const router = express.Router();

// GET
router.get('/', mid.userAuth, user.getUserById); // DONE
router.get('/workspace', mid.userAuth, user.getUserWorkspace); // DONE
router.get('/board', mid.userAuth, user.getUserBoard); // DONE
router.get('/invite', mid.userAuth, user.getInvite); // DONE
router.get('/starred', mid.userAuth, user.getStarredBoard); // DONE
router.get('/recent', mid.userAuth, user.getRecentBoard); // DONE

// POST
router.post('/', user.createUser); // DONE
router.post('/login', user.loginUser); // DONE

// PUT
router.put('/email', mid.userAuth, user.changeEmail); // DONE
router.put('/username', mid.userAuth, user.changeUsername); // DONE
router.put('/bio', mid.userAuth, user.changeBio); // DONE
router.put('/password', mid.userAuth, user.changePassword); // DONE

// DELETE
router.delete('/star/:star_id', mid.userAuth, user.removeStar); // DONE
router.delete('/refuse/:invitation_id', mid.userAuth ,user.refuseInvitation);// DONE
module.exports = router;
