import P from 'bluebird';
import express from 'express';
import mongojs from 'mongojs';

let app = express();

// Database
let db = mongojs(process.env.MONGODB_URI || 'mongodb://localhost:27017/bitcamp');
let iapds = db.collection('iapds');
P.promisifyAll(iapds);

app.get('/iapds', (req, res) => {
  let skip = (req.query.page || 0) * 200;
  iapds.findAsync({}, {
    limit: 200,
    skip: skip
  }).then((docs) => {
    res.json(docs);
  });
});

app.get('/iapds/:iapd', (req, res) => {
  iapds.findOneAsync({
    _id: req.params.iapd
  }).then((doc) => {
    res.json(doc);
  });
});

app.get('/iapds/company/:orgpk', (req, res) => {
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

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
