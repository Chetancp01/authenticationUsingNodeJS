const express = require('express');
require('./config/mongoose');


const app = express();
const port = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

app.use('/', require('./routes'));

app.listen(port, () => {
    console.log(`Server is running on port no port ${port}`);
});