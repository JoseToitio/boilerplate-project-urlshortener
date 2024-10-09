require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
// Basic Configuration
const port = process.env.PORT || 3000;
let urlDatabase = [];
let urlCount = 1;

function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validar URL
  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Adicionar URL à base de dados e retornar resposta com short_url
  const shortUrl = urlCount;
  urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });
  urlCount++;

  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (!urlEntry) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  res.redirect(urlEntry.original_url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
