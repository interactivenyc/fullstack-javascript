import express from 'express';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import config from '../config';

// MongoDB Docs: https://github.com/mongodb/node-mongodb-native

let mdb;

MongoClient.connect(config.mongodbUri, (err, client) => {
  let db = client.db('test');

  assert.equal(null, err);

  mdb = db;
});

const router = express.Router();

router.get('/contests', (req, res) => {
  console.log('[api/index.js] fetching contests:');
  let contests = {};
  mdb.collection('contests').find({})
    .project({ //limit fetched data to these fields
      id: 1,
      categoryName: 1,
      contestName: 1
    })
    .each((err, contest) => {
      assert.equal(null, err);

      if (!contest) { //no more contests
        res.send({ contests });
        return;
      }

      console.log('[api/index.js] contestId: ', contest.id);
      contests[contest.id] = contest;

    });
});

router.get('/contests/:contestId', (req, res) => {
  console.log('[api/index.js] looking for contest:', req.params.contestId);
  mdb.collection('contests')
    .findOne({id: Number(req.params.contestId)})
    .then(contest => res.send(contest))
    .catch(console.error);
});

router.get('/names/:nameIds', (req, res) => {
  console.log('[api/index.js] fetching names:');

  const nameIds = req.params.nameIds.split(',').map(Number);

  let names = {};

  //simulate server time
  setTimeout(function () {
    mdb.collection('names').find({ id: { $in: nameIds }})
      .each((err, name) => {
        assert.equal(null, err);

        if (!name) { //no more names
          res.send({ names });
          return;
        }

        console.log('[api/index.js] nameId: ', name.id);
        names[name.id] = name;

      });
  }, 2000);



});

export default router;
