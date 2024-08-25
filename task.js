const fs = require('fs');

async function task(user_id) {
  const timestamp = new Date().toISOString();
  const logMessage = `${user_id} - Task completed at ${timestamp}\n`;

  console.log(`Logging task completion for user_id: ${user_id} at ${timestamp}`);
  fs.appendFile('task.log', logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

module.exports = { task };
