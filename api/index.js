module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const endpoints = {
    message: "API de consulta de usuários",
    endpoints: {
      discord: "/api/discord/{id} OU /discord/{id}",
      steam: "/api/steam/{id} OU /steam/{id}",
      minecraft: "/api/minecraft/{id} OU /minecraft/{id}",
      user: "/api/user/{username} OU /user/{username}",
      search: "/api/search/{termo} OU /search/{termo}",
      all: "/api/all"
    },
    example: "https://apisaf.vercel.app/discord/806709058698346526",
    note: "Retorna JSON puro, sem HTML/frontend"
  };
  
  return res.json(endpoints);
};
