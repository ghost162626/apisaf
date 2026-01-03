const { loadData } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const data = loadData();
    
    return res.json({
      success: true,
      count: data.length,
      timestamp: new Date().toISOString(),
      data: data
    });
    
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Erro ao carregar dados"
    });
  }
};
