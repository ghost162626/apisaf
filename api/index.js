const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Carrega os dados do JSON
    const dataPath = path.join(__dirname, '..', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Endpoint principal
    if (req.url === '/api' || req.url === '/api/') {
      return res.json({
        message: "API de consulta de usuários",
        endpoints: {
          discord: "/api/discord/:id",
          steam: "/api/steam/:id",
          minecraft: "/api/minecraft/:id",
          usuario: "/api/:username",
          search: "/api/search/:termo",
          all: "/api/all",
          stats: "/api/stats"
        },
        total_users: data.length
      });
    }

    // Lista todos os usuários
    if (req.url === '/api/all') {
      return res.json({
        success: true,
        count: data.length,
        data: data
      });
    }

    // Estatísticas
    if (req.url === '/api/stats') {
      const stats = {
        total_users: data.length,
        unique_ips: [...new Set(data.map(u => u.ip))].length,
        latest_user: data[data.length - 1]?.username || 'N/A',
        first_user: data[0]?.username || 'N/A'
      };
      return res.json(stats);
    }

    // Se não for nenhum endpoint específico, retorna info
    res.json({
      error: false,
      message: "Use endpoints específicos: /discord/:id, /steam/:id, /minecraft/:id, /:username"
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: true,
      message: "Erro interno do servidor"
    });
  }
};