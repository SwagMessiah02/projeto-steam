const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => res.redirect('/amigos'));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));