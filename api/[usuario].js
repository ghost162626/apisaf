const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const dataPath = path.join(__dirname, '..', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Extrai o nome de usuário da URL
    const username = req.query.username || req.url.split('/').pop();

    // Busca flexível
    const results = data.filter(u => {
      const searchTerm = username.toLowerCase();
      return (
        u.username.toLowerCase().includes(searchTerm) ||
        (u.discordid && u.discordid.includes(searchTerm)) ||
        (u.ip && u.ip.toLowerCase().includes(searchTerm))
      );
    });

    if (results.length > 0) {
      return res.json({
        success: true,
        search_term: username,
        count: results.length,
        data: results.map(u => ({
          line: u.line,
          discordid: u.discordid,
          username: u.username,
          ip: u.ip,
          timestamp: u.timestamp,
          platform: u.platform || 'unknown'
        }))
      });
    }

    res.status(404).json({
      error: true,
      message: "Nenhum usuário encontrado",
      search_term: username,
      suggestion: "Tente buscar por ID do Discord, username ou parte do IP"
    });

  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};