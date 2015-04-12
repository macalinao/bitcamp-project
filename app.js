import P from 'bluebird';
import express from 'express';
import mongojs, { ObjectId } from 'mongojs';

let app = express();

// Database
let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bitcamp';
if (process.env.VCAP_APP_SERVICES) {
  let svcs = JSON.parse(process.env.VCAP_APP_SERVICES);
  mongoUri = svcs.mongolab[0].credentials.uri;
}
let db = mongojs(mongoUri);
let iapds = db.collection('iapds');
// Indices
iapds.createIndex({
  'Info.@lastNm': 'text'
});
P.promisifyAll(iapds);

app.get('/iapds', (req, res) => {
  let skip = (req.query.page || 0) * 200;
  iapds.aggregateAsync([
    { $limit: 50000 },
    { $project: { 'Info.@firstNm': 1, 'Info.@lastNm': 1, score: 1 } }
  ]).then((docs) => {
    res.json(docs);
  });
});

app.get('/iapds/:iapd', (req, res) => {
  iapds.findOneAsync({
    _id: ObjectId(req.params.iapd)
  }).then((doc) => {
    res.json(doc);
  });
});

app.get('/companies', (req, res) => {
  iapds.aggregateAsync([
    { $limit: 50000 },
    {
      $group: {
        _id: '$CrntEmps.CrntEmp.@orgPK',
        name: { $first: '$CrntEmps.CrntEmp.@orgNm' },
        iapds: { $push: '$_id' }
      }
    }
  ]).then((docs) => {
    let docMap = {};

    // Map documents
    let ret = docs.filter((doc) => {
      return !Array.isArray(doc._id);
    }).map((doc) => {
      docMap[doc._id] = doc;
      return doc;
    });

    // Filter remaining documents
    docs.filter((doc) => {
      return Array.isArray(doc._id);
    }).map((doc) => {

      for (let i = 0; i < doc._id.length; i++) {
        let _id = doc._id[i];
        let d = docMap[_id];
        if (!d) {
          d = {
            _id: _id,
            name: doc.name[i],
            iapds: []
          };
          docMap[_id] = d;
          ret.push(d);
        }
        d.iapds = d.iapds.concat(doc.iapds);
      }

    });

    res.json(ret);
  });
});

app.get('/companies/:id', (req, res) => {
  iapds.aggregateAsync([
    { $match: { 'CrntEmps.CrntEmp.@orgPK': req.params.id } },
    { $limit: 50000 },
    {
      $group: {
        _id: '$CrntEmps.CrntEmp.@orgPK',
        name: { $first: '$CrntEmps.CrntEmp.@orgNm' },
        info: { $first: '$CrntEmps.CrntEmp' },
        iapds: { $push: '$_id' }
      }
    }
  ]).then((docs) => {
    let docMap = {};

    // Map documents
    let ret = docs.filter((doc) => {
      return !Array.isArray(doc._id);
    }).map((doc) => {
      docMap[doc._id] = doc;
      return doc;
    });

    // Filter remaining documents
    docs.filter((doc) => {
      return Array.isArray(doc._id);
    }).map((doc) => {

      for (let i = 0; i < doc._id.length; i++) {
        let _id = doc._id[i];
        let d = docMap[_id];
        if (!d) {
          d = {
            _id: _id,
            name: doc.name[i],
            iapds: []
          };
          docMap[_id] = d;
          ret.push(d);
        }
        d.iapds = d.iapds.concat(doc.iapds);
      }

    });

    res.json(docMap[req.params.id]);
  });
});

app.get('/search', (req, res) => {
  iapds.findAsync({
    'Info.@lastNm': {
      $regex: req.query.q.toUpperCase()
    }
  }).then((docs) => {
    res.json(docs);
  });
});

app.use(express.static(__dirname + '/public/'));

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
