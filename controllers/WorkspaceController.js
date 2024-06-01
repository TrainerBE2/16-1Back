const db = require('../library/conn');

const createWorkspace = (req, res) => {
  const { name, type_id, visibility_id, description, user_id } = req.body;
  const workspaceQuery = `
    INSERT INTO tbl_workspaces (name, type_id, visibility_id, description)
    VALUES (?, ?, ?, ?);
  `;
  db.query(workspaceQuery, [name, type_id, visibility_id, description], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    const workspace_id = result.insertId;
    setWorkspaceOwner(res, workspace_id, user_id);
  });
};

const setWorkspaceOwner = (res, workspace_id, user_id) => {
  const role_id = 1;
  const memberQuery = `
    INSERT INTO tbl_workspace_members (workspace_id, user_id, role_id)
    VALUES (?, ?, ?);
  `;
  db.query(memberQuery, [workspace_id, user_id, role_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Workspace created successfully and owner set' });
  });
};

const getWorkspaceById = (req, res) => {
  const { workspace_id } = req.params;

  const query = `
    SELECT 
      w.id,
      w.name AS workspace_name,
      w.type_id,
      t.name AS type_name,
      w.visibility_id,
      v.name AS visibility_name,
      w.description,
      w.created_at,
      w.updated_at
    FROM 
      tbl_workspaces w
    JOIN 
      tbl_workspace_types t ON w.type_id = t.id
    JOIN 
      tbl_workspace_visibilitys v ON w.visibility_id = v.id
    WHERE 
      w.id = ?;
  `;

  db.query(query, [workspace_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getBoard = (req, res) => {
  const { workspace_id } = req.params;

  const query = `
  SELECT 
  b.id AS board_id,
  b.board_title,
  b.owner_id,
  u.username AS owner_username,
  b.background,
  bg.name AS background_name,
  b.visibility_id,
  bv.name AS visibility_name,
  b.workspace_id,
  ws.name AS workspace_name,
  b.created_at AS board_created_at,
  b.updated_at AS board_updated_at
FROM 
  tbl_boards b
LEFT JOIN 
  tbl_users u ON b.owner_id = u.id
LEFT JOIN 
  tbl_backgrounds bg ON b.background = bg.id
LEFT JOIN 
  tbl_board_visibilitys bv ON b.visibility_id = bv.id
LEFT JOIN 
  tbl_workspaces ws ON b.workspace_id = ws.id
WHERE 
  b.workspace_id = ? AND b.visibility_id = 3;
  `;

  db.query(query, [workspace_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};


const getMember = (req, res) => {
  const { workspace_id } = req.params;

  const query = `
  SELECT 
  wm.id AS membership_id,
  wm.user_id,
  u.username AS user_username,
  u.email AS user_email,
  wm.role_id,
  wr.name AS role_name,
  wm.created_at AS membership_created_at,
  wm.updated_at AS membership_updated_at
FROM 
  tbl_workspace_members wm
LEFT JOIN 
  tbl_users u ON wm.user_id = u.id
LEFT JOIN 
  tbl_workspace_roles wr ON wm.role_id = wr.id
WHERE 
  wm.workspace_id = ?;
  `;

  db.query(query, [workspace_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const inviteUser = (req, res) => {
  const { invited_user_id, inviter_user_id, workspace_id } = req.body;

  const query = `
    INSERT INTO tbl_workspace_invitations (invited_user_id, inviter_user_id, workspace_id)
    VALUES (?, ?, ?);
  `;

  db.query(query, [invited_user_id, inviter_user_id, workspace_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'User invited successfully', insertId: result.insertId });
  });
};

const acceptWorkspaceInvitation = (req, res) => {
  const { invitation_id, invited_user_id } = req.body;

  const checkQuery = `
    SELECT * FROM tbl_workspace_invitations
    WHERE id = ?;
  `;

  db.query(checkQuery, [invitation_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }
    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Invitation not found or does not belong to the user' });
    }

    const workspace_id = checkResult[0].workspace_id;
    const role_id = 3;

    const insertQuery = `
      INSERT INTO tbl_workspace_members (workspace_id, user_id, role_id, created_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
    `;

    db.query(insertQuery, [workspace_id, invited_user_id, role_id], (insertErr) => {
      if (insertErr) {
        return res.status(500).send(insertErr);
      }

      const deleteQuery = `
        DELETE FROM tbl_workspace_invitations
        WHERE id = ?;
      `;

      db.query(deleteQuery, [invitation_id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          return res.status(500).send(deleteErr);
        }
        res.status(200).json({ message: 'Invitation accepted successfully' });
      });
    });
  });
};

const changeVisibilitytoPublic = (req, res) => {
  const { workspace_id } = req.params;

  const query = `
    UPDATE tbl_workspaces
    SET visibility_id = 2
    WHERE id = ?;
  `;

  db.query(query, [workspace_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.status(200).json({ message: 'Workspace visibility updated to public successfully' });
  });
};

const changeVisibilitytoPrivate = (req, res) => {
  const { workspace_id } = req.params;

  const query = `
    UPDATE tbl_workspaces
    SET visibility_id = 1
    WHERE id = ?;
  `;

  db.query(query, [workspace_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.status(200).json({ message: 'Workspace visibility updated to private successfully' });
  });
};

const changeName = (req, res) => {
  const { workspace_id } = req.params;
  const { name } = req.body;

  const query = `
    UPDATE tbl_workspaces
    SET name = ?
    WHERE id = ?;
  `;

  db.query(query, [name, workspace_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.status(200).json({ message: 'Name updated successfully' });
  });
};

const changeType = (req, res) => {
  const { workspace_id } = req.params;
  const { type_id } = req.body;

  const query = `
    UPDATE tbl_workspaces
    SET type_id = ?
    WHERE id = ?;
  `;

  db.query(query, [type_id, workspace_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.status(200).json({ message: 'Type updated successfully' });
  });
};

const changeDescription = (req, res) => {
  const { workspace_id } = req.params;
  const { description } = req.body;

  const query = `
    UPDATE tbl_workspaces
    SET description = ?
    WHERE id = ?;
  `;

  db.query(query, [description, workspace_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    res.status(200).json({ message: 'Description updated successfully' });
  });
};

const promoteMember = (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE tbl_workspace_members
    SET role_id = '2'
    WHERE id = ?;
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Workspace member not found' });
    }
    res.status(200).json({ message: 'Member promoted successfully' });
  });
};

const getWorkspaceVisibility = (req, res) => {
  const query = `
    SELECT * FROM tbl_workspace_visibilitys;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getWorkspaceType = (req, res) => {
  const query = `
    SELECT * FROM tbl_workspace_types;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const createBoard = (req, res) => {
  const { owner_id, board_title, visibility, background } = req.body;
  const { workspace_id } = req.params;

  const query = `
    INSERT INTO tbl_boards (owner_id, board_title, background, visibility_id, workspace_id)
    VALUES (?, ?, ?, ?, ?);
  `;

  db.query(query, [owner_id, board_title, background, visibility, workspace_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(`Board added with ID: ${result.insertId}`);
  });
};

const deleteWorkspace = (req, res) => {
  const { workspace_id } = req.params;

  const queries = [
    { sql: 'DELETE FROM tbl_workspace_invitations WHERE workspace_id = ?', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_workspace_members WHERE workspace_id = ?', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_list_card_attachments WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)))', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_list_card_checklists WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)))', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_list_card_comments WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)))', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_list_card_covers WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)))', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_list_card_dates WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)))', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_list_card_labels WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)))', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_list_card_members WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)))', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?))', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_lists WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_boards WHERE workspace_id = ?', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_recents_boards WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_starred_boards WHERE board_id IN (SELECT id FROM tbl_boards WHERE workspace_id = ?)', values: [workspace_id] },
    { sql: 'DELETE FROM tbl_workspaces WHERE id = ?', values: [workspace_id] }
  ];

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }

    const executeQuery = (index) => {
      if (index < queries.length) {
        const { sql, values } = queries[index];
        db.query(sql, values, (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send(err);
            });
          }
          executeQuery(index + 1);
        });
      } else {
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send(err);
            });
          }
          res.status(200).json({ message: 'Workspace and related data deleted successfully' });
        });
      }
    };

    executeQuery(0);
  });
};


module.exports = {
  getBoard,
  getMember,
  createBoard,
  deleteWorkspace,
  acceptWorkspaceInvitation,
  createWorkspace,
  getWorkspaceById,
  inviteUser,
  changeVisibilitytoPublic,
  changeVisibilitytoPrivate,
  changeType,
  changeDescription,
  promoteMember,
  getWorkspaceVisibility,
  getWorkspaceType,
  changeName
};
