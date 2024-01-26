const express = require('express');
const cors = require('cors');
const systemeRoute = require('./routes/systeme.route.js');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.use('/', systemeRoute);

app.listen(port, ()=>{
  console.log(`le serveur est lance sur le port ${port}`)
});

