const { searchAll } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const urlParts = req.url.split('/');
    const searchTerm = urlParts[urlParts.length - 1];
    
    if (!searchTerm || searchTerm === 'search') {
      return res.status(400).json({
        error: true,
        message: "Termo de busca não especificado",
        usage: "/search/{termo}",
        example: "https://apisaf.vercel.app/search/3kit"
      });
    }
    
    const results = searchAll(searchTerm);
    
    return res.json({
      success: true,
      search: searchTerm,
      count: results.length,
      results: results.map(r => ({
        line: r.line,
        discordid: r.discordid,
        username: r.username,
        ip: r.ip,
        timestamp: r.timestamp
      }))
    });
    
  } catch (error) {
    console.error('Error in /search:', error);
    return res.status(500).json({
      error: true,
      message: "Erro interno do servidor"
    });
  }
};
