const jwt = require('jsonwebtoken');
const conn = require('./conn');
require('dotenv').config();

const userAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

const invAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    if (parseInt(decoded.userId, 10) !== parseInt(req.body.invited_user_id, 10)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  });
};

const Auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    next();
  });
};

const boardAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    const boardId = parseInt(req.params.board_id, 10);

    conn.query(
      'SELECT * FROM tbl_collaborators WHERE board_id = ? AND user_id = ?',
      [boardId, userId],
      (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(403).json({ message: 'Not authorized' });
        }

        next();
      }
    );
  });
};

const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);

    conn.query(
      'SELECT * FROM tbl_system_roles WHERE user_id = ? AND role_id = 1',
      [userId],
      (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(403).json({ message: 'Not authorized' });
        }

        next();
      }
    );
  });
};

const boardCollaboratorsAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    const boardId = parseInt(req.params.board_id, 10);

    conn.query(
      'SELECT * FROM tbl_collaborators WHERE board_id = ? AND user_id = ? AND privilege_id = 2',
      [boardId, userId],
      (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(403).json({ message: 'Not authorized hehe' });
        }

        next();
      }
    );
  });
};

const listEditAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    const listId = parseInt(req.params.list_id, 10); // Assuming the list ID is in req.params.list_id

    // Query to get the board_id from tbl_lists using listId
    conn.query('SELECT board_id FROM tbl_lists WHERE id = ?', [listId], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'List not found' });
      }

      const boardId = results[0].board_id;
      console.log(boardId)

      // Query to check if the user has the necessary privilege
      conn.query(
        'SELECT * FROM tbl_collaborators WHERE board_id = ? AND user_id = ? AND privilege_id = 2',
        [boardId, userId],
        (err, results) => {
          if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }

          if (results.length === 0) {
            return res.status(403).json({ message: 'Not authorized' });
          }

          next();
        }
      );
    });
  });
};

const listAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    const listId = parseInt(req.params.list_id, 10); // Assuming the list ID is in req.params.list_id

    // Query to get the board_id from tbl_lists using listId
    conn.query('SELECT board_id FROM tbl_lists WHERE id = ?', [listId], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'List not found' });
      }

      const boardId = results[0].board_id;
      console.log(boardId)

      // Query to check if the user has the necessary privilege
      conn.query(
        'SELECT * FROM tbl_collaborators WHERE board_id = ? AND user_id = ? AND privilege_id IN (1, 2)',
        [boardId, userId],
        (err, results) => {
          if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }

          if (results.length === 0) {
            return res.status(403).json({ message: 'Not authorized' });
          }

          next();
        }
      );
    });
  });
};

const workspaceAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    const workspaceId = parseInt(req.params.workspace_id, 10);
    conn.query('SELECT * FROM tbl_workspace_members WHERE workspace_id = ? AND user_id = ?', [workspaceId, userId], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      next();
    });
  });
};

const workspaceAdminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    let workspaceId;
    if (req.params.workspace_id) {
        workspaceId = parseInt(req.params.workspace_id, 10);
    }
    if (!workspaceId && req.body.workspace_id) {
        workspaceId = parseInt(req.body.workspace_id, 10);
    }
    if (isNaN(workspaceId)) {
        res.status(400).json({ error: 'Invalid or missing workspace_id' });
        return;
    }
    
    conn.query(
      'SELECT * FROM tbl_workspace_members WHERE workspace_id = ? AND user_id = ? AND (role_id = 1 OR role_id = 2)',
      [workspaceId, userId],
      (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(403).json({ message: 'Not authorized from' });
        }
        next();
      }
    );
  });
};

const cardAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    const list_card_id = parseInt(req.params.list_card_id, 10);

    conn.query('SELECT list_id FROM tbl_list_cards WHERE id = ?', [list_card_id], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'List card not found' });
      }

      const list_id = results[0].list_id;

      conn.query('SELECT board_id FROM tbl_lists WHERE id = ?', [list_id], (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'List not found' });
        }

        const boardId = results[0].board_id;

        conn.query(
          'SELECT * FROM tbl_collaborators WHERE board_id = ? AND user_id = ? AND (privilege_id = 1 OR privilege_id = 2)',
          [boardId, userId],
          (err, results) => {
            if (err) {
              console.error('Error querying database:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.length === 0) {
              return res.status(403).json({ message: 'Not authorized' });
            }

            next();
          }
        );
      });
    });
  });
};

const cardEditAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    const list_card_id = parseInt(req.params.list_card_id, 10);

    conn.query('SELECT list_id FROM tbl_list_cards WHERE id = ?', [list_card_id], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'List card not found' });
      }

      const list_id = results[0].list_id;

      conn.query('SELECT board_id FROM tbl_lists WHERE id = ?', [list_id], (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'List not found' });
        }

        const boardId = results[0].board_id;

        conn.query(
          'SELECT * FROM tbl_collaborators WHERE board_id = ? AND user_id = ? AND privilege_id = 2',
          [boardId, userId],
          (err, results) => {
            if (err) {
              console.error('Error querying database:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.length === 0) {
              return res.status(403).json({ message: 'Not authorized' });
            }

            next();
          }
        );
      });
    });
  });
};

const cardCommentEditAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = parseInt(decoded.userId, 10);
    const listCardId = parseInt(req.params.list_card_id, 10);

    conn.query('SELECT list_id FROM tbl_list_cards WHERE id = ?', [listCardId], (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'List card not found' });
      }

      const listId = results[0].list_id;

      conn.query('SELECT board_id FROM tbl_lists WHERE id = ?', [listId], (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'List not found' });
        }

        const boardId = results[0].board_id;

        conn.query(
          'SELECT * FROM tbl_collaborators WHERE board_id = ? AND user_id = ? AND privilege_id = 2',
          [boardId, userId],
          (err, collaboratorResults) => {
            if (err) {
              console.error('Error querying database:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (collaboratorResults.length > 0) {
              return next();
            }

            conn.query(
              'SELECT * FROM tbl_list_card_comments WHERE list_card_id = ? AND userid = ?',
              [listCardId, userId],
              (err, commentResults) => {
                if (err) {
                  console.error('Error querying database:', err);
                  return res.status(500).json({ message: 'Internal Server Error' });
                }

                if (commentResults.length > 0) {
                  return next();
                }

                return res.status(403).json({ message: 'Not authorized' });
              }
            );
          }
        );
      });
    });
  });
};

module.exports = {
  boardCollaboratorsAuth,
  userAuth,
  Auth,
  cardCommentEditAuth,
  listAuth,
  invAuth,
  cardAuth,
  cardEditAuth,
  listEditAuth,
  adminAuth,
  boardAuth,
  workspaceAuth,
  workspaceAdminAuth
};