const fsp = require('fs/promises');
const path = require('path');
const express = require('express');
const dgram = require('dgram');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Пути к конфигам серверов
const SERVER_CONFIGS = {
  1: '/var/lib/pterodactyl/volumes/83bd61dd-3938-4a67-b22c-0404e106dc1e/garrysmod/cfg/server.cfg',
  2: '/var/lib/pterodactyl/volumes/d63dc708-2d17-4e62-b2d7-072e440813f3/garrysmod/cfg/server.cfg'
};

// Проверка пароля в конфиге
async function hasPassword(serverId) {
  try {
    const config = await fsp.readFile(SERVER_CONFIGS[serverId], 'utf-8');
    const match = config.match(/sv_password\s+"([^"]*)"/);
    return match && match[1] && match[1].length > 0;
  } catch (e) {
    return false;
  }
}

// Функция для A2S_INFO запроса
function queryServerA2S(host, port) {
  return new Promise((resolve) => {
    const client = dgram.createSocket('udp4');
    
    const packet = Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0x54, 0x53, 0x6F, 0x75, 
      0x72, 0x63, 0x65, 0x20, 0x45, 0x6E, 0x67, 0x69, 
      0x6E, 0x65, 0x20, 0x51, 0x75, 0x65, 0x72, 0x79, 0x00
    ]);
    
    const timeout = setTimeout(() => {
      client.close();
      resolve({ online: false, players: 0, maxplayers: 128 });
    }, 3000);

    let challengeReceived = false;

    client.on('message', (msg) => {
      if (msg[4] === 0x41 && !challengeReceived) {
        challengeReceived = true;
        const challenge = msg.slice(5, 9);
        const challengePacket = Buffer.concat([
          Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0x54]),
          Buffer.from('Source Engine Query\x00'),
          challenge
        ]);
        client.send(challengePacket, 0, challengePacket.length, port, host);
        return;
      }

      if (msg[4] === 0x49) {
        clearTimeout(timeout);
        client.close();
        
        try {
          let offset = 6;
          
          while (offset < msg.length && msg[offset] !== 0) offset++;
          offset++;
          while (offset < msg.length && msg[offset] !== 0) offset++;
          offset++;
          while (offset < msg.length && msg[offset] !== 0) offset++;
          offset++;
          while (offset < msg.length && msg[offset] !== 0) offset++;
          offset++;
          
          offset += 2;
          
          const players = msg[offset];
          const maxplayers = msg[offset + 1];
          
          resolve({ online: true, players, maxplayers });
        } catch (e) {
          resolve({ online: false, players: 0, maxplayers: 128 });
        }
      }
    });

    client.on('error', () => {
      clearTimeout(timeout);
      client.close();
      resolve({ online: false, players: 0, maxplayers: 128 });
    });

    client.send(packet, 0, packet.length, port, host);
  });
}

app.get('/api/servers', async (req, res) => {
  const servers = [
    { id: 1, name: '[#1] Восточная ветка', host: '37.230.162.213', port: 2033 },
    { id: 2, name: '[#2] Западная ветка', host: '37.230.162.213', port: 2034 }
  ];

  const results = await Promise.all(
    servers.map(async (s) => {
      const data = await queryServerA2S(s.host, s.port);
      const hasPass = await hasPassword(s.id);
      
      return {
        id: s.id,
        name: s.name,
        online: data.online,
        hasPassword: hasPass,
        players: data.players,
        maxplayers: data.maxplayers,
        map: data.online ? 'Online' : 'Offline'
      };
    })
  );

  res.json(results);
});

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
