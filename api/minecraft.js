const { loadData } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const urlParts = req.url.split('/');
    const minecraftName = urlParts[urlParts.length - 1];
    
    if (!minecraftName || minecraftName === 'minecraft') {
      return res.status(400).json({
        error: true,
        message: "Nome do Minecraft não especificado",
        usage: "/minecraft/{name}",
        example: "https://apisaf.vercel.app/minecraft/Player123"
      });
    }
    
    const data = loadData();
    
    // Adapte conforme sua estrutura
    const users = data.filter(u => {
      // Se tiver campo minecraft_name
      if (u.minecraft_name && u.minecraft_name.toLowerCase().includes(minecraftName.toLowerCase())) 
        return true;
      // Ou busca em username
      if (u.username && u.username.toLowerCase().includes(minecraftName.toLowerCase()))
        return true;
      return false;
    });
    
    if (users.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Usuário Minecraft não encontrado",
        minecraft_name: minecraftName
      });
    }
    
    return res.json({
      success: true,
      count: users.length,
      platform: "Minecraft",
      data: users.map(u => ({
        line: u.line,
        username: u.username,
        minecraft_name: u.minecraft_name || u.username,
        ip: u.ip,
        timestamp: u.timestamp
      }))
    });
    
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
