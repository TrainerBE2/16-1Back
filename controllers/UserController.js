const conn = require('../library/conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getUserWorkspace = (req, res) => {
  const { user_id } = req.params;
  const query = `
    SELECT * FROM tbl_workspace_members
    WHERE user_id = ?;
  `;

  conn.query(query, [user_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getUserBoard = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT * FROM tbl_boards
    WHERE owner_id = ? OR id IN (
      SELECT board_id FROM tbl_collaborators WHERE user_id = ?
    );
  `;

  conn.query(query, [user_id, user_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getStarredBoard = (req, res) => {
  const { user_id } = req.params;
  const query = `
  SELECT 
  b.id AS board_id, 
  b.board_title, 
  b.workspace_id, 
  w.name AS workspace_name
FROM 
  tbl_starred_boards sb
JOIN 
  tbl_boards b ON sb.board_id = b.id
JOIN 
  tbl_workspaces w ON b.workspace_id = w.id
WHERE 
  sb.user_id = ?;

  `;

  conn.query(query, [user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
};

const getInvite = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT * FROM tbl_workspace_invitations
    WHERE invited_user_id = ?;
  `;

  conn.query(query, [user_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

const getUserById = (req, res) => {
  const { user_id } = req.params;
  conn.query('SELECT * FROM tbl_users WHERE id = ?', [user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(result[0]);
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT id, password FROM tbl_users WHERE email = ?';
  conn.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error', error: err });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Password comparison error', error: err });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const accessToken = jwt.sign({ userId: user.id, email: email }, process.env.JWT_SECRET, { expiresIn: '4h' });

      res.json({ accessToken });
    });
  });
};

const getUserNotification = (req, res) => {

};

const getUserActivity = (req, res) => {

};

const getRecentBoard = (req, res) => {
  const { user_id } = req.params;
  const query = `
  SELECT 
  b.id AS board_id, 
  b.board_title, 
  b.workspace_id, 
  w.name AS workspace_name
FROM 
  tbl_recents_boards rb
JOIN 
  tbl_boards b ON rb.board_id = b.id
JOIN 
  tbl_workspaces w ON b.workspace_id = w.id
WHERE 
  rb.user_id = ?;

  `;

  conn.query(query, [user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });

};

const createUser = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(req.body);

  const checkUserQuery = 'SELECT email FROM tbl_users WHERE email = ?';
  conn.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error', error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO tbl_users (email, password, username) VALUES (?, ?, ?)';
      conn.query(query, [email, hashedPassword, username], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database insert error', error: err });
        }
        res.status(201).json({ message: `User added with ID: ${result.insertId}` });
      });
    } catch (hashError) {
      return res.status(500).json({ message: 'Password hashing error', error: hashError });
    }
  });
};

const removeStar = (req, res) => {
  const { star_id } = req.params;

  const query = `
    DELETE FROM tbl_starred_boards
    WHERE id = ?;
  `;

  conn.query(query, [star_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Star not found' });
    }
    res.status(200).json({ message: 'Star removed successfully' });
  });
};

const refuseInvitation = (req, res) => {
  const { invitation_id } = req.params;

  const checkQuery = `
    SELECT * FROM tbl_workspace_invitations
    WHERE id = ?;
  `;

  conn.query(checkQuery, [invitation_id], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }
    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'Invitation not found or does not belong to the user' });
    }

    const deleteQuery = `
      DELETE FROM tbl_workspace_invitations
      WHERE id = ?;
    `;

    conn.query(deleteQuery, [invitation_id], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).send(deleteErr);
      }
      res.status(200).json({ message: 'Invitation refused successfully' });
    });
  });
};

const changePassword = async (req, res) => {
  const { user_id } = req.params;
  const { old_password, new_password } = req.body;

  if (!user_id || !old_password || !new_password) {
    return res.status(400).json({ message: 'User ID, old password, and new password are required' });
  }

  // Query to get the current hashed password
  const getPasswordQuery = 'SELECT password FROM tbl_users WHERE id = ?';
  conn.query(getPasswordQuery, [user_id], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentHashedPassword = results[0].password;

    const isPasswordMatch = await bcrypt.compare(old_password, currentHashedPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    try {
      const newHashedPassword = await bcrypt.hash(new_password, 10);
      const updateQuery = 'UPDATE tbl_users SET password = ? WHERE id = ?';
      conn.query(updateQuery, [newHashedPassword, user_id], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database update error', error: err });
        }
        res.status(200).json({ message: 'Password updated successfully' });
      });
    } catch (hashError) {
      return res.status(500).json({ message: 'Password hashing error', error: hashError });
    }
  });
};

const changeUsername = (req, res) => {
  const { user_id } = req.params;
  const { username } = req.body;

  const query = `
    UPDATE tbl_users
    SET username = ?
    WHERE id = ?;
  `;

  conn.query(query, [username, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Username updated successfully' });
  });
};

const changeEmail = (req, res) => {
  const { user_id } = req.params;
  const { email } = req.body;

  const query = `
    UPDATE tbl_users
    SET email = ?
    WHERE id = ?;
  `;

  conn.query(query, [email, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Email updated successfully' });
  });
};

const changeBio = (req, res) => {
  const { user_id } = req.params;
  const { bio } = req.body;

  const query = `
    UPDATE tbl_users
    SET bio = ?
    WHERE id = ?;
  `;

  conn.query(query, [bio, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Bio updated successfully' });
  });
};

module.exports = {
  getRecentBoard, getStarredBoard, getInvite, getUserBoard, getUserWorkspace, getUserById,
  createUser,
  changePassword,
  loginUser,
  getUserNotification,
  getUserActivity,
  removeStar,
  changeEmail,
  changeUsername,
  changeBio,
  refuseInvitation
};
