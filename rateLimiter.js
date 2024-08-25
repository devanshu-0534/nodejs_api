const { createClient } = require('redis');
const { queueTask } = require('./taskQueue'); 
const client = createClient();

client.connect().catch((err) => {
  console.error('Redis connection error:', err);
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const WINSEC = 60;  
const MAXRESEC = 1;
const MAXRESMIN = 20;

module.exports = async (req, res, next) => {
  const userId = req.body.user_id;
  if (!userId) {
    return res.status(400).send({ error: 'user_id is required' });
  }

  console.log(`Rate limiter check for user_id: ${userId}`);

  try {
    const [secondRequests, , minuteRequests] = await client
      .multi()
      .incr(`requests_${userId}_second`)
      .expire(`requests_${userId}_second`, 1)
      .incr(`requests_${userId}_minute`)
      .expire(`requests_${userId}_minute`, WINSEC)
      .exec();

    console.log(`Rate limiter check for user_id: ${userId}`);

    if (secondRequests > MAXRESEC || minuteRequests > MAXRESMIN) {
      console.log(`Rate limit exceeded for user_id: ${userId}, queuing request.`);
      return queueTask(userId, () => {
        console.log(`Processing queued request for user_id: ${userId}`);
        res.status(200).send({message: 'More requests in a fixed spaan of time' }) 
      });
    }

    console.log(`Rate limit passed for user_id: ${userId}`);
    next();  
  } catch (err) {
    console.error('Redis error:', err);
    return res.status(500).send({ error: 'Internal server error' });
  }
};
