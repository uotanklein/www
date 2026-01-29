const fsp = require('fs/promises');
const path = require('path');
const express = require('express');
const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/how_to_play_gm', (req, res) => {
  res.sendFile(path.join(__dirname, 'how_to_play_gm.html'));
});

app.get('/index_coming', (req, res) => {
  res.sendFile(path.join(__dirname, 'index_coming.html'));
});

app.get('/load_screen', (req, res) => {
  res.sendFile(path.join(__dirname, 'load_screen.html'));
});

const get_list = async (url, ext, req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}/${url}`;
    const dirPath = path.join(__dirname, 'public', url);
    const files = await fsp.readdir(dirPath);
    const filtered = files.filter(f => f.endsWith(`.${ext}`));
    const urls = filtered.map(file => `${baseUrl}/${encodeURIComponent(file)}`);
    res.json(urls);
  } catch (err) {
    console.error('Error reading directory:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

app.get('/bgs/list', async (req, res) => {
  await get_list('bgs', 'png', req, res);
});

app.get('/music/list', async (req, res) => {
  await get_list('music', 'ogg', req, res);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Сервер запущен на http://127.0.0.1:${PORT}`); 
});