const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const dataPath = path.join(__dirname, '..', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Este é um exemplo - você pode adaptar para sua estrutura de dados Steam
    const steamId = req.query.id || req.url.split('/').pop();
    
    // Busca genérica (adaptar conforme seus dados)
    const users = data.filter(u => 
      u.platform === 'steam' || 
      u.username.includes(steamId) ||
      (u.steamid && u.steamid === steamId)
    );

    if (users.length > 0) {
      return res.json({
        success: true,
        count: users.length,
        platform: "Steam",
        search_id: steamId,
        data: users
      });
    }

    res.status(404).json({
      error: true,
      message: "Nenhum usuário Steam encontrado",
      steam_id: steamId
    });

  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};