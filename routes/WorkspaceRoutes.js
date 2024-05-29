const express = require('express');
const workspace = require('../controllers/WorkspaceController');
const mid = require('../library/Middleware');
const router = express.Router();

// GET
router.get('/visibilitys', mid.Auth, workspace.getWorkspaceVisibility); // DONE
router.get('/types', mid.Auth, workspace.getWorkspaceType); // DONE
router.get('/:workspace_id', mid.workspaceAuth, workspace.getWorkspaceById); // DONE
router.get('/:workspace_id/boards', mid.workspaceAuth, workspace.getBoard); // DONE
router.get('/:workspace_id/members', mid.workspaceAuth, workspace.getMember); // DONE

// POST
router.post('/', mid.Auth, workspace.createWorkspace); // DONE
router.post('/:workspace_id/board', mid.workspaceAuth, workspace.createBoard);  // DONE
router.post('/invite', mid.workspaceAdminAuth , workspace.inviteUser); // DONE
router.post('/invitation/accept',mid.invAuth, workspace.acceptWorkspaceInvitation); // DONE

// PUT
router.put('/:workspace_id/visibility/public', mid.workspaceAdminAuth, workspace.changeVisibilitytoPublic); // DONE
router.put('/:workspace_id/visibility/private', mid.workspaceAdminAuth, workspace.changeVisibilitytoPrivate); // DONE
router.put('/:workspace_id/type', mid.workspaceAdminAuth, workspace.changeType); // DONE
router.put('/:workspace_id/name', mid.workspaceAdminAuth, workspace.changeName); // DONE
router.put('/:workspace_id/description', mid.workspaceAdminAuth, workspace.changeDescription); //DONE
router.put('/:workspace_id/member/:id/promote', mid.workspaceAdminAuth, workspace.promoteMember); // DONE

// DELETE
router.delete('/:workspace_id', mid.workspaceAdminAuth ,workspace.deleteWorkspace);  // DONE

module.exports = router;
