const express = require('express');
const bodyParser = require('body-parser');
const { queueTask } = require('./taskQueue');
const { task } = require('./task');
const rateLimiter = require('./rateLimiter');
const app = express();
app.use(bodyParser.json());

app.post('/api/v1/task', rateLimiter, (req, res) => {
  console.log(req.body);

  const userId = req.body.user_id;
  if (!userId) {
    return res.status(400).send({ error: 'user_id is required' });
  }

  console.log(`Received task request for user_id: ${userId}`);
  queueTask(userId, () => {
    console.log(`Processing task for user_id: ${userId}`);
    task(userId);
  });

  res.status(200).send({ status: 'Task queued' });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
