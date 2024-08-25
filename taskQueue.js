const taskQueue = {};

function queueTask(user_id, task) {
  console.log(`Queueing task for user_id: ${user_id}`);
  if (!taskQueue[user_id]) {
    taskQueue[user_id] = [];
  }
  taskQueue[user_id].push(task);
  console.log(`Task queue for user_id: ${user_id} now has ${taskQueue[user_id].length} tasks`);
  if (taskQueue[user_id].length === 1) {
    processQueue(user_id);
  }
}

function processQueue(user_id) {
  if (taskQueue[user_id] && taskQueue[user_id].length > 0) {
    const nextTask = taskQueue[user_id].shift(); 
    console.log(`Processing task for user_id: ${user_id}`);
    nextTask(); 
    setTimeout(() => {
      processQueue(user_id);
    }, 1000);
  } else {
    console.log(`No more tasks for user_id: ${user_id}`);
  }
}

module.exports = { queueTask };
