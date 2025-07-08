
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

const agent = new https.Agent({ rejectUnauthorized: false });

app.use(express.static('public'));

app.get('/api/double', async (req, res) => {
  try {
    const response = await axios.get('https://blaze.bet/pt/games/double', {
      timeout: 60000,
      httpsAgent: agent
    });
    const $ = cheerio.load(response.data);
    const script = $('script#__NEXT_DATA__').html();
    const json = JSON.parse(script);
    const dados = json.props.pageProps.history || [];

    const formatados = dados.map(d => ({
      value: d.roll,
      timestamp: d.createdAt
    }));

    res.json(formatados.slice(0, 50));
  } catch (error) {
    console.error("Erro ao buscar resultados:", error.message);
    res.status(500).json({ erro: 'Erro ao buscar resultados' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Bot rodando na porta ${PORT}`);
});
