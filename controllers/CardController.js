const conn = require('../library/conn');

const getCover = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT lcc.*, tu.username, tu.email
  FROM tbl_list_card_covers AS lcc
  JOIN tbl_users AS tu ON lcc.adder_id = tu.id
  WHERE lcc.list_card_id = ?;  
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getComment = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
  c.id AS comment_id, 
  c.list_card_id, 
  c.comment, 
  c.created_at AS comment_created_at, 
  c.updated_at AS comment_updated_at,
  u.id AS user_id,
  u.email,
  u.username
FROM 
  tbl_list_card_comments c
JOIN 
  tbl_users u
ON 
  c.userid = u.id
WHERE 
  c.list_card_id = ?;
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getMember = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
  lcm.id AS member_id,
  lcm.list_card_id,
  lcm.user_id,
  u1.username AS member_username,
  u1.email AS member_email,
  lcm.created_at AS member_created_at,
  lcm.updated_at AS member_updated_at,
  lcm.adder_id,
  u2.username AS adder_username,
  u2.email AS adder_email
FROM 
  tbl_list_card_members lcm
JOIN 
  tbl_users u1 ON lcm.user_id = u1.id
LEFT JOIN 
  tbl_users u2 ON lcm.adder_id = u2.id
WHERE 
  lcm.list_card_id = ?;

  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getChecklist = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
  lcc.id AS checklist_id,
  lcc.list_card_id,
  lcc.title AS checklist_title,
  lcc.status_id,
  lcs.name AS status_name,
  lcc.adder_id,
  u.username AS adder_username,
  lcc.created_at AS checklist_created_at,
  lcc.updated_at AS checklist_updated_at
FROM 
  tbl_list_card_checklists AS lcc
LEFT JOIN 
  tbl_list_card_status AS lcs ON lcc.status_id = lcs.id
LEFT JOIN 
  tbl_users AS u ON lcc.adder_id = u.id
WHERE 
  lcc.list_card_id = ?;
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getLabel = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT 
  lcl.id AS label_id,
  lcl.list_card_id,
  lcl.color,
  lcl.title AS label_title,
  lcl.created_at AS label_created_at,
  lcl.updated_at AS label_updated_at,
  u.username AS adder_username
FROM 
  tbl_list_card_labels AS lcl
LEFT JOIN 
  tbl_users AS u ON lcl.adder_id = u.id
WHERE 
  lcl.list_card_id = ?;

  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const addComment = (req, res) => {
  const { comment, user_id } = req.body;
  const list_card_id = req.params.list_card_id;
  const query = `
      INSERT INTO tbl_list_card_comments (list_card_id, comment,userid)
      VALUES (?, ? ,? );
    `;

  conn.query(query, [list_card_id, comment, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Comment added successfully', insertId: result.insertId });
  });
};

const addDate = (req, res) => {
  const { deadline, adder_id } = req.body;
  const list_card_id = req.params.list_card_id;
  const checkQuery = `
    SELECT * FROM tbl_list_card_dates 
    WHERE list_card_id = ?;
  `;

  conn.query(checkQuery, [list_card_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }

    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Deadline already exists for the card' });
    }
    const insertQuery = `
      INSERT INTO tbl_list_card_dates (list_card_id, deadline, adder_id)
      VALUES (?, ?, ?);
    `;

    conn.query(insertQuery, [list_card_id, deadline, adder_id], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).send(insertErr);
      }
      res.status(201).json({ message: 'Date added successfully', insertId: result.insertId });
    });
  });
};

const addCardMember = (req, res) => {
  const { user_id, adder_id } = req.body;
  const list_card_id = req.params.list_card_id;

  // Check if the card member already exists
  const checkQuery = `
    SELECT * FROM tbl_list_card_members 
    WHERE list_card_id = ? AND user_id = ?;
  `;

  conn.query(checkQuery, [list_card_id, user_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }

    // If the card member already exists, return a conflict status
    if (checkResult.length > 0) {
      return res.status(409).json({ message: 'Card member already exists' });
    }

    // If the card member doesn't exist, insert it into the database
    const insertQuery = `
      INSERT INTO tbl_list_card_members (list_card_id, user_id, adder_id)
      VALUES (?, ?, ?);
    `;

    conn.query(insertQuery, [list_card_id, user_id, adder_id], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).send(insertErr);
      }
      res.status(201).json({ message: 'Card member added successfully', insertId: result.insertId });
    });
  });
};

const addCardLabel = (req, res) => {
  const { color, title, adder_id } = req.body;
  const list_card_id = req.params.list_card_id;
  const query = `
    INSERT INTO tbl_list_card_labels (list_card_id, color, title, adder_id)
    VALUES (?, ?, ? , ?);
  `;
  conn.query(query, [list_card_id, color, title, adder_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Card label added successfully', insertId: result.insertId });
  });
};

const addChecklist = (req, res) => {
  const { title, adder_id } = req.body; 
  const list_card_id = req.params.list_card_id;
  const query = `
    INSERT INTO tbl_list_card_checklists (list_card_id, title, adder_id)
    VALUES (?, ?, ?);
  `;

  conn.query(query, [list_card_id, title, adder_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Checklist added successfully', insertId: result.insertId });
  });
};

const getDate = (req, res) => {
  const list_card_id = req.params.list_card_id;

  const query = `
  SELECT u.username AS adder_username, u.email AS adder_email, lc.adder_id, lc.deadline, lc.created_at, lc.updated_at
  FROM tbl_users u
  JOIN tbl_list_card_dates lc ON u.id = lc.adder_id
  WHERE lc.list_card_id = ?;  
  `;

  conn.query(query, [list_card_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const archiveCard = (req, res) => {
  const { id } = req.params;

  const query = `
      UPDATE list_card
      SET archived_status_id = '2'
      WHERE id = ?;
    `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json({ message: 'Card archived successfully' });
  });
};

const changeTitle = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const query = `
      UPDATE tbl_list_card
      SET title = ?
      WHERE id = ?;
    `;

  conn.query(query, [title, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json({ message: 'Title updated successfully' });
  });
};

const setChecklistDone = (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE tbl_list_card_checklists 
    SET status_id = '2' 
    WHERE id = ?;
  `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }
    res.status(200).json({ message: 'Checklist item set to done successfully' });
  });
};

const setChecklistOnTheWay = (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE tbl_list_card_checklists 
    SET status_id = '1' 
    WHERE id = ?;
  `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Checklist item not found' });
    }
    res.status(200).json({ message: 'Checklist item set to on the way successfully' });
  });
};

const changeComment = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const query = `
      UPDATE tbl_list_card_comments
      SET comment = ?
      WHERE id = ?;
    `;

  conn.query(query, [comment, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment updated successfully' });
  });
};

const changeDate = (req, res) => {
  const { id } = req.params;
  const { deadline } = req.body;

  const query = `
    UPDATE tbl_list_card_dates
    SET deadline = ?
    WHERE id = ?;
  `;

  conn.query(query, [deadline, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Date not found' });
    }
    res.status(200).json({ message: 'Date updated successfully' });
  });
};

const deleteDate = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM tbl_list_card_dates
    WHERE id = ?;
  `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Date not found' });
    }
    res.status(200).json({ message: 'Date deleted successfully' });
  });
};


const changeLabel = (req, res) => {
  const { id } = req.params;
  const { title, color } = req.body;
  let query = 'UPDATE tbl_list_card_labels SET ';
  let queryParams = [];
  let updates = [];
  if (title) {
    updates.push('title = ?');
    queryParams.push(title);
  }
  if (color) {
    updates.push('color = ?');
    queryParams.push(color);
  }
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }
  query += updates.join(', ') + ' WHERE id = ?';
  queryParams.push(id);

  conn.query(query, queryParams, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Label not found' });
    }
    res.status(200).json({ message: 'Label updated successfully' });
  });
};

const changeChecklist = (req, res) => {
  const { id } = req.params;
  const { title, status_id } = req.body;

  const query = `
    UPDATE tbl_list_card_checklists
    SET title = ?, status_id = ?, updated_at = CURRENT_TIMESTAMP()
    WHERE id = ?;
  `;

  conn.query(query, [title, status_id, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Checklist not found' });
    }
    res.status(200).json({ message: 'Checklist updated successfully' });
  });
};

const deleteComment = (req, res) => {
  const { id } = req.params;

  const query = `
      DELETE FROM tbl_list_card_comments
      WHERE id = ?;
    `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  });
};

const removeCardMember = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM tbl_list_card_members
    WHERE id = ?;
  `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json({ message: 'Card member removed successfully' });
  });
};

const removeCardLabel = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM tbl_list_card_labels
    WHERE id = ?;
  `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Label not found' });
    }
    res.status(200).json({ message: 'Card label removed successfully' });
  });
};

const deleteChecklist = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM tbl_list_card_checklists
    WHERE id = ?;
  `;

  conn.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Checklist not found' });
    }
    res.status(200).json({ message: 'Checklist deleted successfully' });
  });
};

const addCover = (req, res) => {
  const { list_card_id } = req.params;
  const { cover ,adder_id } = req.body;

  if (!cover) {
    return res.status(400).json({ message: 'Cover URL is required' });
  }

  // Check if a cover already exists for the given list_card_id
  const checkQuery = `
    SELECT * FROM tbl_list_card_covers WHERE list_card_id = ?;
  `;

  conn.query(checkQuery, [list_card_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'A cover already exists for this card' });
    }

    // Proceed to insert the new cover if no existing cover is found
    const insertQuery = `
      INSERT INTO tbl_list_card_covers (list_card_id, cover , adder_id ) 
      VALUES (?, ? , ?);
    `;

    const values = [list_card_id, cover, adder_id ];

    conn.query(insertQuery, values, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).json({ message: 'Cover added successfully' });
    });
  });
};

const changeCover = (req, res) => {
  const { list_card_id } = req.params;
  const { cover } = req.body;

  if (!cover) {
    return res.status(400).json({ message: 'Cover URL is required' });
  }

  const query = `
    UPDATE tbl_list_card_covers
    SET cover = ?
    WHERE list_card_id = ?;
  `;

  const values = [cover, list_card_id];

  conn.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found or cover not updated' });
    }
    res.status(200).json({ message: 'Cover updated successfully' });
  });
};

const deleteCover = (req, res) => {
  const { list_card_id } = req.params;

  const query = `
    DELETE FROM tbl_list_card_covers
    WHERE list_card_id = ?;
  `;

  const values = [list_card_id];

  conn.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cover not found' });
    }
    res.status(200).json({ message: 'Cover deleted successfully' });
  });
};


const addAttachments = (req, res) => {
  const { list_card_id } = req.params;
  const { file_path } = req.body;

  if (!file_path) {
    return res.status(400).json({ message: 'File path is required' });
  }

  const query = `
    INSERT INTO tbl_list_card_attachments (list_card_id, file_path) 
    VALUES (?, ?);
  `;

  const values = [list_card_id, file_path];

  conn.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json({ message: 'Attachment added successfully' });
  });
};


const deleteAttachments = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM tbl_list_card_attachments 
    WHERE id = ?;
  `;

  const values = [id];

  conn.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No attachments found for this card' });
    }
    res.status(200).json({ message: 'Attachments deleted successfully' });
  });
};


const deleteCard = (req, res) => {
  const { ilist_card_id } = req.params;

  const queries = [
    { sql: 'DELETE FROM tbl_list_card_attachments WHERE list_card_id = ?', values: [ilist_card_id] },
    { sql: 'DELETE FROM tbl_list_card_checklists WHERE list_card_id = ?', values: [ilist_card_id] },
    { sql: 'DELETE FROM tbl_list_card_comments WHERE list_card_id = ?', values: [ilist_card_id] },
    { sql: 'DELETE FROM tbl_list_card_covers WHERE list_card_id = ?', values: [ilist_card_id] },
    { sql: 'DELETE FROM tbl_list_card_dates WHERE list_card_id = ?', values: [ilist_card_id] },
    { sql: 'DELETE FROM tbl_list_card_labels WHERE list_card_id = ?', values: [ilist_card_id] },
    { sql: 'DELETE FROM tbl_list_card_members WHERE list_card_id = ?', values: [ilist_card_id] },
    { sql: 'DELETE FROM tbl_list_cards WHERE id = ?', values: [ilist_card_id] }
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
          res.status(200).json({ message: 'Card and related data deleted successfully' });
        });
      }
    };

    executeQuery(0);
  });
};


const getAttachments = (req, res) => {
  const { list_card_id } = req.params;

  const query = `
    SELECT * FROM tbl_list_card_attachments 
    WHERE list_card_id = ?;
  `;

  const values = [list_card_id];

  conn.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No attachments found for this card' });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  getAttachments, getDate, deleteDate,
  addCover, changeCover, deleteCover, addAttachments, deleteAttachments,
  getCover, getComment, getChecklist, getMember, getLabel, deleteCard,
  addCardLabel, addDate, addChecklist, deleteChecklist, changeChecklist,
  archiveCard, changeTitle, addComment, changeComment, deleteComment,
  setChecklistDone, setChecklistOnTheWay, changeDate, changeLabel,
  addCardMember, removeCardMember, removeCardLabel
};
