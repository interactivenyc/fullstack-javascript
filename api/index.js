import express from 'express';
import data from '../src/testData';

const router = express.Router();

router.get('/Contests', (req, res) => {
  res.send({contests: data.contests});
});

export default router;
