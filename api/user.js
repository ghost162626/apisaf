const { findUserByUsername } = require('./_lib');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Extrai username da URL
    const urlParts = req.url.split('/');
    const username = urlParts[urlParts.length - 1];
    
    if (!username || username === 'user') {
      return res.status(400).json({
        error: true,
        message: "Username não especificado",
        usage: "/user/{username} OU /api/user/{username}",
        example: "https://apisaf.vercel.app/user/806709058698346526"
      });
    }
    
    // Busca usuários
    const users = findUserByUsername(username);
    
    if (users.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Usuário não encontrado",
        searched: username,
        suggestions: [
          "Verifique se o username está correto",
          "Tente buscar pelo ID do Discord",
          "Ou busque por parte do username/IP"
        ]
      });
    }
    
    // Formata resposta
    const response = {
      success: true,
      search: username,
      count: users.length,
      data: users.map(user => ({
        line: user.line,
        discordid: user.discordid,
        username: user.username,
        ip: user.ip || null,
        timestamp: user.timestamp || null
      }))
    };
    
    return res.json(response);
    
  } catch (error) {
    console.error('Error in /user:', error);
    return res.status(500).json({
      error: true,
      message: "Erro interno do servidor"
    });
  }
};
