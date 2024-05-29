const conn = require('../library/conn');

const seedQueries = [

];

const migrationQueries = [

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

function executeQueries(queries, queryType) {
  return new Promise((resolve, reject) => {
    queries.forEach((query, index) => {
      conn.query(query, (err) => {
        if (err) {
          console.error(`Error running ${queryType} query:`, err);
          return reject(err);
        }
        console.log(`${queryType} query executed successfully:`, query);
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
      await executeQueries(migrationQueries, 'Migration');
    } catch (err) {
      console.error('Migration failed:', err);
    }
  } else if (options['-seed']) {
    try {
      await executeQueries(seedQueries, 'Seed');
    } catch (err) {
      console.error('Seeding failed:', err);
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
