const { findUserByDiscordId, findUserByUsername } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const urlParts = req.url.split('/');
    const discordId = urlParts[urlParts.length - 1];
    
    if (!discordId || discordId === 'discord') {
      return res.status(400).json({
        error: true,
        message: "ID do Discord não especificado",
        usage: "/discord/{id} OU /api/discord/{id}",
        example: "https://apisaf.vercel.app/discord/806709058698346526"
      });
    }
    
    // Busca por discordid exato
    let user = findUserByDiscordId(discordId);
    
    // Se não encontrou, busca por username
    if (!user) {
      const users = findUserByUsername(discordId);
      if (users.length === 1) {
        user = users[0];
      }
    }
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Usuário do Discord não encontrado",
        discord_id: discordId
      });
    }
    
    // Resposta direta
    return res.json({
      success: true,
      found_by: user.discordid === discordId ? 'discordid' : 'username',
      user: {
        line: user.line,
        discordid: user.discordid,
        username: user.username,
        ip: user.ip || null,
        timestamp: user.timestamp || null
      }
    });
    
  } catch (error) {
    console.error('Error in /discord:', error);
    return res.status(500).json({
      error: true,
      message: "Erro interno do servidor"
    });
  }
};
