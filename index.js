require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');
const { fetchNews } = require('./services/rssService');
const { saveArticle, setMemoryStore } = require('./controllers/articleController');

const app = express();
app.use(cors({
  origin: "https://newsmania-frontend.vercel.app",
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running...");
});


app.use('/api/news', articleRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'healthy' }));

const startServer = async () => {
  const mongoConnected = await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    fetchNews(saveArticle);
  });
};

startServer();