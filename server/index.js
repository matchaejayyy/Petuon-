require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');

const cors = require('cors')

const { Pool } = require('pg');

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

app.listen(PORT, () => { //declares server port running on 3002
    console.log(`Server running on port ${PORT}`)
  }
)   
