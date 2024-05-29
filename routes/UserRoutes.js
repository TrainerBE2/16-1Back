const express = require('express');
const user = require('../controllers/UserController');
const mid = require('../library/Middleware');
const router = express.Router();

// GET
router.get('/:user_id', mid.userAuth, user.getUserById); // DONE
router.get('/:user_id/workspace', mid.userAuth, user.getUserWorkspace); // DONE
router.get('/:user_id/board', mid.userAuth, user.getUserBoard); // DONE
router.get('/:user_id/invite', mid.userAuth, user.getInvite); // DONE 
router.get('/:user_id/starred', mid.userAuth, user.getStarredBoard); // DONE
router.get('/:user_id/recent', mid.userAuth, user.getRecentBoard); // DONE

// POST
router.post('/', user.createUser); // DONE
router.post('/login', user.loginUser); // DONE

// PUT
router.put('/:user_id/email', mid.userAuth, user.changeEmail); // DONE
router.put('/:user_id/username', mid.userAuth, user.changeUsername); // DONE
router.put('/:user_id/bio', mid.userAuth, user.changeBio); // DONE
router.put('/:user_id/password', mid.userAuth, user.changePassword); // DONE

// DELETE
router.delete('/:user_id/star/:star_id', mid.userAuth, user.removeStar); // DONE
router.delete('/:user_id/refuse/:invitation_id', mid.userAuth ,user.refuseInvitation);// DONE
module.exports = router;
