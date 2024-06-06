const conn = require('../library/conn');

const seedQueries = [

];

const ConstraintQueries = [
  `ALTER TABLE tbl_boards
  ADD CONSTRAINT tbl_boards_ibfk_1 FOREIGN KEY (owner_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_boards_ibfk_2 FOREIGN KEY (background) REFERENCES tbl_backgrounds (id),
  ADD CONSTRAINT tbl_boards_ibfk_3 FOREIGN KEY (visibility_id) REFERENCES tbl_board_visibilitys (id),
  ADD CONSTRAINT tbl_boards_ibfk_4 FOREIGN KEY (workspace_id) REFERENCES tbl_workspaces (id);`
  ,
  `ALTER TABLE tbl_collaborators
  ADD CONSTRAINT tbl_collaborators_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_collaborators_ibfk_2 FOREIGN KEY (board_id) REFERENCES tbl_boards (id),
  ADD CONSTRAINT tbl_collaborators_ibfk_3 FOREIGN KEY (privilege_id) REFERENCES tbl_board_privileges (id);`
  ,
  `ALTER TABLE tbl_lists
  ADD CONSTRAINT tbl_lists_ibfk_1 FOREIGN KEY (board_id) REFERENCES tbl_boards (id);`
  ,
  `ALTER TABLE tbl_list_cards
  ADD CONSTRAINT tbl_list_cards_ibfk_1 FOREIGN KEY (list_id) REFERENCES tbl_lists (id),
  ADD CONSTRAINT tbl_list_cards_ibfk_2 FOREIGN KEY (archived_status_id) REFERENCES tbl_list_card_archived_status (id);`
  ,
  `ALTER TABLE tbl_list_card_attachments
  ADD CONSTRAINT fk_adder_id69 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_attachments_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);`
  ,
  `ALTER TABLE tbl_list_card_checklists
  ADD CONSTRAINT fk_adder_id_12 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_checklists_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id),
  ADD CONSTRAINT tbl_list_card_checklists_ibfk_2 FOREIGN KEY (status_id) REFERENCES tbl_list_card_status (id);`
  ,
  `ALTER TABLE tbl_list_card_comments
  ADD CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_comments_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);`
  ,
  `ALTER TABLE tbl_list_card_covers
  ADD CONSTRAINT fk_adder_id420 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_covers_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);`
  ,
  `ALTER TABLE tbl_list_card_dates
  ADD CONSTRAINT fk_adder_id3 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_dates_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);`
  ,
  `ALTER TABLE tbl_list_card_labels
  ADD CONSTRAINT fk_adder_id2 FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_labels_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id);
`,
  `ALTER TABLE tbl_list_card_members
  ADD CONSTRAINT fk_adder_id FOREIGN KEY (adder_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_list_card_members_ibfk_1 FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id),
  ADD CONSTRAINT tbl_list_card_members_ibfk_2 FOREIGN KEY (user_id) REFERENCES tbl_users (id);`
  ,
  `ALTER TABLE tbl_recents_boards
  ADD CONSTRAINT tbl_recents_boards_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_recents_boards_ibfk_2 FOREIGN KEY (board_id) REFERENCES tbl_boards (id);`
  ,
  `ALTER TABLE tbl_starred_boards
  ADD CONSTRAINT tbl_starred_boards_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_starred_boards_ibfk_2 FOREIGN KEY (board_id) REFERENCES tbl_boards (id);`
  ,
  `ALTER TABLE tbl_system_roles
  ADD CONSTRAINT tbl_system_roles_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_system_roles_ibfk_2 FOREIGN KEY (role_id) REFERENCES tbl_roles (id);`
  ,
  `ALTER TABLE tbl_user_activitys
  ADD CONSTRAINT fk_list_card_id FOREIGN KEY (list_card_id) REFERENCES tbl_list_cards (id),
  ADD CONSTRAINT tbl_user_activitys_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_user_activitys_ibfk_6 FOREIGN KEY (action_id) REFERENCES tbl_user_action_on_boards (id);`
  ,
  `ALTER TABLE tbl_user_notifications
  ADD CONSTRAINT tbl_user_notifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES tbl_users (id);`
  ,
  `ALTER TABLE tbl_workspaces
  ADD CONSTRAINT tbl_workspaces_ibfk_1 FOREIGN KEY (type_id) REFERENCES tbl_workspace_types (id);`
  ,
  `ALTER TABLE tbl_workspace_invitations
  ADD CONSTRAINT tbl_workspace_invitations_ibfk_1 FOREIGN KEY (invited_user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_workspace_invitations_ibfk_2 FOREIGN KEY (inviter_user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_workspace_invitations_ibfk_3 FOREIGN KEY (workspace_id) REFERENCES tbl_workspaces (id);`
  ,
  `ALTER TABLE tbl_workspace_members
  ADD CONSTRAINT tbl_workspace_members_ibfk_1 FOREIGN KEY (workspace_id) REFERENCES tbl_workspaces (id),
  ADD CONSTRAINT tbl_workspace_members_ibfk_2 FOREIGN KEY (user_id) REFERENCES tbl_users (id),
  ADD CONSTRAINT tbl_workspace_members_ibfk_3 FOREIGN KEY (role_id) REFERENCES tbl_workspace_roles (id);`


];

const ExtraQueries = [

  `ALTER TABLE tbl_backgrounds
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_boards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;`
  ,
  `ALTER TABLE tbl_collaborators
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_lists
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_cards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_attachments
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_checklists
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_comments
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_covers
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_dates
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_labels
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_list_card_members
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_recents_boards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_roles
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_starred_boards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_system_roles
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_users
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_user_action_on_boards
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_user_activitys
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_user_notifications
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_workspaces
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
`,
  `ALTER TABLE tbl_workspace_invitations
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_workspace_members
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`
  ,
  `ALTER TABLE tbl_workspace_types
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;`

];

const migrationQueries = [

  `  CREATE TABLE tbl_backgrounds (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_boards (
    id int(11) NOT NULL,
    owner_id int(11) DEFAULT NULL,
    board_title varchar(255) DEFAULT NULL,
    background int(11) DEFAULT NULL,
    visibility_id int(11) DEFAULT NULL,
    workspace_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_board_privileges (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_board_visibilitys (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_collaborators (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    board_id int(11) DEFAULT NULL,
    privilege_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_lists (
    id int(11) NOT NULL,
    title varchar(255) DEFAULT NULL,
    board_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_list_cards (
    id int(11) NOT NULL,
    title varchar(255) DEFAULT NULL,
    list_id int(11) DEFAULT NULL,
    archived_status_id int(11) DEFAULT 1,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    description text DEFAULT NULL
  );`

  ,
  `  CREATE TABLE tbl_list_card_archived_status (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,

  `  CREATE TABLE tbl_list_card_attachments (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    file_path varchar(255) DEFAULT NULL,
    name varchar(255) NOT NULL,
    adder_id int(11) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_list_card_checklists (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    title varchar(255) DEFAULT NULL,
    status_id int(11) DEFAULT 1,
    adder_id int(11) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_list_card_comments (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    comment text DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    userid int(11) DEFAULT NULL
  );`
  ,
  `  CREATE TABLE tbl_list_card_covers (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    cover varchar(255) DEFAULT NULL,
    adder_id int(11) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_list_card_dates (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    deadline datetime DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    adder_id int(11) DEFAULT NULL
  );`
  ,
  `  CREATE TABLE tbl_list_card_labels (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    color varchar(255) DEFAULT NULL,
    title varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    adder_id int(11) DEFAULT NULL
  );`
  ,

  `  CREATE TABLE tbl_list_card_members (
    id int(11) NOT NULL,
    list_card_id int(11) DEFAULT NULL,
    user_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    adder_id int(11) DEFAULT NULL
  );`
  ,
  `  
  CREATE TABLE tbl_list_card_status (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_recents_boards (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    board_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_roles (
    id int(11) NOT NULL,
    name varchar(50) NOT NULL
  );`

  ,
  `  CREATE TABLE tbl_starred_boards (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    board_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,

  `  CREATE TABLE tbl_system_roles (
    id int(11) NOT NULL,
    user_id int(11) NOT NULL,
    role_id int(11) NOT NULL
  );`
  ,
  `  CREATE TABLE tbl_users (
    id int(11) NOT NULL,
    email varchar(255) DEFAULT NULL,
    password varchar(255) DEFAULT NULL,
    username varchar(255) DEFAULT NULL,
    bio text DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_user_action_on_boards (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,
  `  CREATE TABLE tbl_user_activitys (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    action_id int(11) DEFAULT NULL,
    list_card_id int(11) NOT NULL,
    detailed varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,

  `  CREATE TABLE tbl_user_notifications (
    id int(11) NOT NULL,
    user_id int(11) DEFAULT NULL,
    notification text DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_workspaces (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    type_id int(11) DEFAULT NULL,
    description varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,
  `  CREATE TABLE tbl_workspace_invitations (
    id int(11) NOT NULL,
    invited_user_id int(11) DEFAULT NULL,
    inviter_user_id int(11) DEFAULT NULL,
    workspace_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`
  ,

  `  CREATE TABLE tbl_workspace_members (
    id int(11) NOT NULL,
    workspace_id int(11) DEFAULT NULL,
    user_id int(11) DEFAULT NULL,
    role_id int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

  ,

  `  CREATE TABLE tbl_workspace_roles (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );
  `
  ,
  `  CREATE TABLE tbl_workspace_types (
    id int(11) NOT NULL,
    name varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  );`

];

const keyQueries = [
  `  ALTER TABLE tbl_backgrounds
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_boards
  ADD PRIMARY KEY (id),
  ADD KEY owner_id (owner_id),
  ADD KEY background (background),
  ADD KEY visibility_id (visibility_id),
  ADD KEY workspace_id (workspace_id);`
  ,
  `ALTER TABLE tbl_board_privileges
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_board_visibilitys
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_collaborators
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY board_id (board_id),
  ADD KEY privilege_id (privilege_id);`
  ,
  `ALTER TABLE tbl_lists
  ADD PRIMARY KEY (id),
  ADD KEY board_id (board_id);`
  ,
  `ALTER TABLE tbl_list_cards
  ADD PRIMARY KEY (id),
  ADD KEY list_id (list_id),
  ADD KEY archived_status_id (archived_status_id);`
  ,
  `ALTER TABLE tbl_list_card_archived_status
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_list_card_attachments
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_adder_id69 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_checklists
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY status_id (status_id),
  ADD KEY fk_adder_id_12 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_comments
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_userid (userid);`
  ,
  `ALTER TABLE tbl_list_card_covers
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_adder_id420 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_dates
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_adder_id3 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_labels
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY fk_adder_id2 (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_members
  ADD PRIMARY KEY (id),
  ADD KEY list_card_id (list_card_id),
  ADD KEY user_id (user_id),
  ADD KEY fk_adder_id (adder_id);`
  ,
  `ALTER TABLE tbl_list_card_status
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_recents_boards
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY board_id (board_id);`
  ,
  `ALTER TABLE tbl_roles
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_starred_boards
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY board_id (board_id);`
  ,
  `ALTER TABLE tbl_system_roles
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY role_id (role_id);`
  ,
  `ALTER TABLE tbl_users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email),
  ADD UNIQUE KEY username (username);`
  ,
  `ALTER TABLE tbl_user_action_on_boards
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_user_activitys
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY action_id (action_id),
  ADD KEY fk_list_card_id (list_card_id);`
  ,
  `ALTER TABLE tbl_user_notifications
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id);`
  ,
  `ALTER TABLE tbl_workspaces
  ADD PRIMARY KEY (id),
  ADD KEY type_id (type_id);`
  ,
  `ALTER TABLE tbl_workspace_invitations
  ADD PRIMARY KEY (id),
  ADD KEY invited_user_id (invited_user_id),
  ADD KEY inviter_user_id (inviter_user_id),
  ADD KEY workspace_id (workspace_id);`
  ,
  `ALTER TABLE tbl_workspace_members
  ADD PRIMARY KEY (id),
  ADD KEY workspace_id (workspace_id),
  ADD KEY user_id (user_id),
  ADD KEY role_id (role_id);`
  ,
  `ALTER TABLE tbl_workspace_roles
  ADD PRIMARY KEY (id);`
  ,
  `ALTER TABLE tbl_workspace_types
  ADD PRIMARY KEY (id);`
];

function parseArguments(args) {
  const options = {};
  args.forEach((arg, index) => {
    if (arg.startsWith('-')) {
      options[arg] = true;
    }
  });
  return options;
}

const args = process.argv.slice(2);
const options = parseArguments(args);

function executeCreateTableQueries(queries, queryType) {
  return new Promise((resolve, reject) => {
    queries.forEach((query, index) => {
      conn.query(query, (err) => {
        if (err) {
          console.error(`Error running ${queryType} query:`, err);
          return reject(err);
        }
        const tableNameMatch = query.match(/CREATE TABLE (\w+)/i);
        const tableName = tableNameMatch ? tableNameMatch[1] : 'Unknown table';
        console.log(`${queryType} query executed successfully for table: ${tableName}`);
        if (index === queries.length - 1) {
          resolve();
        }
      });
    });
  });
}

function executeAddExtraQueries(queries, queryType) {
  return new Promise((resolve, reject) => {
    queries.forEach((query, index) => {
      conn.query(query, (err) => {
        if (err) {
          console.error(`Error running ${queryType} query:`, err);
          return reject(err);
        }
        const tableNameMatch = query.match(/ALTER TABLE (\w+)/i);
        const tableName = tableNameMatch ? tableNameMatch[1] : 'Unknown table';
        console.log(`${queryType} query executed successfully for table: ${tableName}`);
        if (index === queries.length - 1) {
          resolve();
        }
      });
    });
  });
}

function executeAddConstraint(queries, queryType) {
  return new Promise((resolve, reject) => {
    queries.forEach((query, index) => {
      conn.query(query, (err) => {
        if (err) {
          console.error(`Error running ${queryType} query:`, err);
          return reject(err);
        }
        const tableNameMatch = query.match(/ALTER TABLE (\w+)/i);
        const tableName = tableNameMatch ? tableNameMatch[1] : 'Unknown table';
        console.log(`${queryType} query executed successfully for table: ${tableName}`);
        if (index === queries.length - 1) {
          resolve();
        }
      });
    });
  });
}

function executeAddKeyQueries(queries, queryType) {
  return new Promise((resolve, reject) => {
    queries.forEach((query, index) => {
      conn.query(query, (err) => {
        if (err) {
          console.error(`Error running ${queryType} query:`, err);
          return reject(err);
        }
        if (queryType === 'ALTER TABLE') {
          const keyMatch = query.match(/ADD (?:PRIMARY KEY|KEY) (\w+)/i);
          const keyName = keyMatch ? keyMatch[1] : 'Unknown key';
          console.log(`Key "${keyName}" added successfully.`);
        }
        const tableNameMatch = query.match(/ALTER TABLE (\w+)/i);
        const tableName = tableNameMatch ? tableNameMatch[1] : 'Unknown table';
        console.log(`${queryType} query executed successfully for table: ${tableName}`);
        if (index === queries.length - 1) {
          resolve();
        }
      });
    });
  });
}

async function run() {
  if (options['-migrate']) {
    try {
      await executeCreateTableQueries(migrationQueries, 'Migration');
    } catch (err) {
      console.error('Migration failed:', err);
    }
  } else if (options['-key']) {
    try {
      await executeAddKeyQueries(keyQueries, 'Add Key');
    } catch (err) {
      console.error('Add Key failed:', err);
    }
  } else if (options['-extra']) {
    try {
      await executeAddExtraQueries(ExtraQueries, 'Add Extra');
    } catch (err) {
      console.error('Add Extra failed:', err);
    }
  } else if (options['-constraint']) {
    try {
      await executeAddConstraint(ConstraintQueries, 'Add Constraint');
    } catch (err) {
      console.error('Add Constraint failed:', err);
    }
  } else {
    console.log('No valid option provided. Use -migrate or -seed.');
  }

  conn.end((err) => {
    if (err) {
      console.error('Error closing MySQL conn:', err);
      return;
    }
    console.log('MySQL conn closed');
  });
}

run();