import P from 'bluebird';
import express from 'express';
import monk from 'monk';


let app = express();

// Database
let db = monk(process.env.MONGODB_URI || 'mongodb://localhost:27017/bitcamp');
let iapds = db.get('iapds');
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

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
