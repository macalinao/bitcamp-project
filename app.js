import P from 'bluebird';
import express from 'express';
import monk from 'monk';


let app = express();

// Database
let db = monk(process.env.MONGODB_URI || 'mongodb://localhost:27017/bitcamp');
let iapds = db.get('iapds');
P.promisifyAll(iapds);

app.get('/iapds', (req, res) => {
  iapds.findAsync({}, { limit: 50 }).then((docs) => {
    res.json(docs);
  });
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
