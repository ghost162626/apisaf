const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const dataPath = path.join(__dirname, '..', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    const { query } = req;
    const discordId = query.id || req.url.split('/').pop();

    if (!discordId) {
      return res.status(400).json({
        error: true,
        message: "ID do Discord não fornecido. Use: /api/discord/ID_DO_USUARIO"
      });
    }

    // Busca por discordid
    const userByDiscordId = data.find(u => u.discordid === discordId);
    
    // Se não encontrar por discordid, busca por username
    const userByUsername = data.find(u => 
      u.username === discordId || 
      u.ip?.toLowerCase().includes(discordId.toLowerCase())
    );

    const user = userByDiscordId || userByUsername;

    if (user) {
      // Formata a resposta
      const response = {
        success: true,
        user: {
          line: user.line,
          discordid: user.discordid,
          username: user.username,
          ip: user.ip || 'N/A',
          timestamp: user.timestamp || 'N/A',
          platform: "Discord"
        },
        found_by: userByDiscordId ? 'discordid' : userByUsername ? 'username/ip' : 'unknown'
      };
      return res.json(response);
    }

    // Se não encontrou
    res.status(404).json({
      error: true,
      message: "Usuário não encontrado",
      discord_id: discordId,
      total_users_searched: data.length
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: true,
      message: "Erro interno do servidor"
    });
  }
};