const conn = require('../library/conn');

const getBoardById = (req, res) => {
  const { board_id } = req.params;
  conn.query('SELECT * FROM tbl_boards WHERE id = ?', [board_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('Board not found');
    }
    res.status(200).json(result[0]);
  });
};

const getCollaborator = (req, res) => {
  const { board_id } = req.params;

  const query = `
  SELECT 
  c.id AS collaborator_id,
  c.user_id,
  u.username AS user_username,
  u.email AS user_email,
  c.privilege_id,
  bp.name AS privilege_name,
  c.created_at AS collaborator_created_at,
  c.updated_at AS collaborator_updated_at
FROM 
  tbl_collaborators c
LEFT JOIN 
  tbl_users u ON c.user_id = u.id
LEFT JOIN 
  tbl_board_privileges bp ON c.privilege_id = bp.id
WHERE 
  c.board_id = ?;
  `;

  conn.query(query, [board_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getList = (req, res) => {
  const { board_id } = req.params;

  const query = `
    SELECT * FROM tbl_lists
    WHERE board_id = ?;
  `;

  conn.query(query, [board_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const updateBoard = (req, res) => {
  const { board_id } = req.params;
  const { board_title, visibility, background } = req.body;
  const query = 'UPDATE `tbl_boards` SET `board_title` = ?, `visibility_id` = ?, `background` = ? WHERE `id` = ?';

  conn.query(query, [board_title, visibility, background, board_id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(`Board updated with ID: ${board_id}`);
  });
};

const deleteBoard = (req, res) => {
  const { board_id } = req.params;

  const queries = [
    { sql: 'DELETE FROM tbl_list_card_attachments WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_checklists WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_comments WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_covers WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_dates WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_labels WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_card_members WHERE list_card_id IN (SELECT id FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?))', values: [board_id] },
    { sql: 'DELETE FROM tbl_list_cards WHERE list_id IN (SELECT id FROM tbl_lists WHERE board_id = ?)', values: [board_id] },
    { sql: 'DELETE FROM tbl_lists WHERE board_id = ?', values: [board_id] },
    { sql: 'DELETE FROM tbl_collaborators WHERE board_id = ?', values: [board_id] },
    { sql: 'DELETE FROM tbl_recents_boards WHERE board_id = ?', values: [board_id] },
    { sql: 'DELETE FROM tbl_starred_boards WHERE board_id = ?', values: [board_id] },
    { sql: 'DELETE FROM tbl_boards WHERE id = ?', values: [board_id] }
  ];

  conn.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }

    const executeQuery = (index) => {
      if (index < queries.length) {
        const { sql, values } = queries[index];
        conn.query(sql, values, (err, result) => {
          if (err) {
            return conn.rollback(() => {
              res.status(500).send(err);
            });
          }
          executeQuery(index + 1);
        });
      } else {
        conn.commit(err => {
          if (err) {
            return conn.rollback(() => {
              res.status(500).send(err);
            });
          }
          res.status(200).json({ message: 'Board and related data deleted successfully' });
        });
      }
    };

    executeQuery(0);
  });
};


const starBoard = (req, res) => {
  const { user_id, board_id } = req.body;
  const checkQuery = `
    SELECT * FROM tbl_starred_boards 
    WHERE user_id = ? AND board_id = ?;
  `;

  conn.query(checkQuery, [user_id, board_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Board already starred' });
    }

    const insertQuery = `
      INSERT INTO tbl_starred_boards (user_id, board_id)
      VALUES (?, ?);
    `;

    conn.query(insertQuery, [user_id, board_id], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).send(insertErr);
      }
      res.status(201).json({ message: 'Board starred successfully', insertId: result.insertId });
    });
  });
};

const setRecent = (req, res) => {
  const { user_id, board_id } = req.body;

  const checkExistenceQuery = `
    SELECT \`id\` FROM \`tbl_recents_boards\` 
    WHERE \`user_id\` = ? AND \`board_id\` = ?
  `;

  const updateTimestampQuery = `
    UPDATE \`tbl_recents_boards\` 
    SET \`updated_at\` = current_timestamp() 
    WHERE \`id\` = ?
  `;

  const insertQuery = `
    INSERT INTO \`tbl_recents_boards\` (\`user_id\`, \`board_id\`, \`created_at\`, \`updated_at\`) 
    VALUES (?, ?, current_timestamp(), current_timestamp())
  `;

  const countQuery = `
    SELECT COUNT(*) as count FROM \`tbl_recents_boards\` 
    WHERE \`user_id\` = ?
  `;

  const deleteOldestQuery = `
    DELETE FROM \`tbl_recents_boards\` 
    WHERE \`id\` = (
      SELECT \`id\` FROM \`tbl_recents_boards\` 
      WHERE \`user_id\` = ? 
      ORDER BY \`created_at\` ASC 
      LIMIT 1
    )
  `;

  conn.query(checkExistenceQuery, [user_id, board_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.length > 0) {
      const id = result[0].id;
      conn.query(updateTimestampQuery, [id], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send('Recent board updated.');
      });
    } else {
      conn.query(insertQuery, [user_id, board_id], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }

        conn.query(countQuery, [user_id], (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }

          const count = result[0].count;
          if (count > 7) {
            conn.query(deleteOldestQuery, [user_id], (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }

              res.status(201).send('Recent board added and oldest one removed.');
            });
          } else {
            res.status(201).send('Recent board added.');
          }
        });
      });
    }
  });
};

const changeBoardTitle = (req, res) => {
  const { board_id } = req.params;
  const { board_title } = req.body;

  const query = `
    UPDATE tbl_boards
    SET board_title = ?
    WHERE id = ?;
  `;

  conn.query(query, [board_title, board_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json({ message: 'Board title updated successfully' });
  });
};

const getBoardVisibility = (req, res) => {
  const query = `
    SELECT * FROM tbl_board_visibilitys;
  `;

  conn.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getBoardPrivilege = (req, res) => {
  const query = `
    SELECT * FROM tbl_board_privileges;
  `;

  conn.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const addList = (req, res) => {
  const { title } = req.body;
  const { board_id } = req.params;
  const getMaxOrderQuery = `
    SELECT MAX(\`order\`) as maxOrder
    FROM tbl_lists
    WHERE board_id = ?
  `;

  const insertQuery = `
    INSERT INTO tbl_lists (title, \`order_number\`, board_id)
    VALUES (?, ?, ?);
  `;

  conn.query(getMaxOrderQuery, [board_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    const maxOrder = result[0].maxOrder !== null ? result[0].maxOrder : 0;
    const newOrder = maxOrder + 1;

    conn.query(insertQuery, [title, newOrder, board_id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json({ message: 'List added successfully', insertId: result.insertId });
    });
  });
};

module.exports = {
  getCollaborator,
  getList,
  addList,
  getBoardById,
  updateBoard,
  deleteBoard,
  setRecent,
  starBoard,
  getBoardVisibility,
  getBoardPrivilege,
  changeBoardTitle
};
