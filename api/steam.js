const { loadData } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const urlParts = req.url.split('/');
    const steamId = urlParts[urlParts.length - 1];
    
    if (!steamId || steamId === 'steam') {
      return res.status(400).json({
        error: true,
        message: "ID da Steam não especificado",
        usage: "/steam/{id}",
        example: "https://apisaf.vercel.app/steam/76561197960287930"
      });
    }
    
    const data = loadData();
    
    // Adapte conforme sua estrutura de dados Steam
    const users = data.filter(u => {
      // Exemplo: se tiver campo steamid
      if (u.steamid && u.steamid === steamId) return true;
      // Ou busca por username
      if (u.username && u.username.includes(steamId)) return true;
      return false;
    });
    
    if (users.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Usuário Steam não encontrado",
        steam_id: steamId
      });
    }
    
    return res.json({
      success: true,
      count: users.length,
      platform: "Steam",
      data: users
    });
    
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
