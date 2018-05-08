import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import assert from 'assert';
import config from '../config';

// MongoDB Docs: https://github.com/mongodb/node-mongodb-native

let mdb;

MongoClient.connect(config.mongodbUri, (err, client) => {
  let db = client.db('tutorial1');

  assert.equal(null, err);

  mdb = db;
});

const router = express.Router();

router.get('/contests', (req, res) => {
  console.log('[api/index.js] fetching contests:');
  let contests = {};
  mdb.collection('contests').find({})
    .project({ //limit fetched data to these fields
      categoryName: 1,
      contestName: 1
    })
    .each((err, contest) => {
      assert.equal(null, err);

      if (!contest) { //no more contests
        res.send({ contests });
        return;
      }

      console.log('[api/index.js] contestId: ', contest._id);
      contests[contest._id] = contest;

    });
});

router.get('/contests/:contestId', (req, res) => {
  console.log('[api/index.js] looking for contest:', req.params.contestId);
  mdb.collection('contests')
    .findOne({_id: ObjectID(req.params.contestId)})
    .then(contest => res.send(contest))
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
});


router.get('/names/:nameIds', (req, res) => {
  console.log('[api/index.js] fetching names:');

  const nameIds = req.params.nameIds.split(',').map(ObjectID);

  let names = {};

  //simulate server time
  setTimeout(function () {
    mdb.collection('names').find({ _id: { $in: nameIds }})
      .each((err, name) => {
        assert.equal(null, err);

        if (!name) { //no more names
          res.send({ names });
          return;
        }

        console.log('[api/index.js] nameId: ', name._id);
        names[name._id] = name;

      });
  }, 500);
});

router.post('/names', (req, res) => {
  console.log('[api/index.js] posting names:');
  //res.send(req.body);
  const contestId = ObjectID(req.body.contestId);
  const name = req.body.newName;
  //validation

  mdb.collection('names').insertOne({ name }).then(result => {
    console.log(result.insertedId, contestId);
    mdb.collection('contests').findAndModify( // insert the new name
      { _id: contestId },
      [],
      { $push: { nameIds: result.insertedId } },
      { new: true }
    ).then(doc => { // send the result back to the UI
      //console.log(doc);
      res.send({
        updatedContest: doc.value,
        newName: { _id: result.insertedId, name }
      });
    })

      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request from findAndModify');
      });

  });
});


export default router;
