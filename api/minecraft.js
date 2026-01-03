const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const dataPath = path.join(__dirname, '..', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    const minecraftUser = req.query.id || req.url.split('/').pop();
    
    // Busca por usuários Minecraft (ajuste conforme seus dados)
    const users = data.filter(u => 
      u.platform === 'minecraft' ||
      u.minecraft_name === minecraftUser ||
      u.username.toLowerCase().includes(minecraftUser.toLowerCase())
    );

    if (users.length > 0) {
      return res.json({
        success: true,
        count: users.length,
        platform: "Minecraft",
        search: minecraftUser,
        data: users.map(u => ({
          line: u.line,
          username: u.username,
          minecraft_name: u.minecraft_name || u.username,
          ip: u.ip,
          timestamp: u.timestamp
        }))
      });
    }

    res.status(404).json({
      error: true,
      message: "Nenhum usuário Minecraft encontrado",
      minecraft_user: minecraftUser
    });

  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};