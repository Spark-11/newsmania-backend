const Article = require('../models/Article');
const { getSummary } = require('../services/summaryService');
const { fetchNews } = require('../services/rssService');


let inMemoryArticles = [];
let isUsingMemoryStore = false;


const setMemoryStore = (useMemory) => {
  isUsingMemoryStore = useMemory;
};


async function saveArticle(articleData) {
  const articleWithSummary = { ...articleData, summary: null };

  if (isUsingMemoryStore) {
    const exists = inMemoryArticles.some(a => a.link === articleData.link);
    if (!exists) {
      const article = { ...articleWithSummary, _id: Date.now().toString() };
      inMemoryArticles.push(article);
      return article;
    }
    return null;
  } else {
    const existing = await Article.findOne({ link: articleData.link });
    if (!existing) {
      return await Article.create(articleWithSummary);
    }
    return null;
  }
}

// fetch articles
const fetchArticles = async (source = null, limit = 20) => {
  if (isUsingMemoryStore) {
    let articles = [...inMemoryArticles];
    if (source) {
      articles = articles.filter(a => a.source === source);
    }
    return articles.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)).slice(0, limit);
  } else {
    const query = source ? { source } : {};
    return await Article.find(query).sort({ publishDate: -1 }).limit(limit);
  }
};


const getAllArticles = async (req, res) => {
  try {
    const articles = await fetchArticles();
    res.json(articles);
  } catch (err) {
    console.error('Error fetching all articles:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};


const getArticlesBySource = async (req, res) => {
  try {
    const articles = await fetchArticles(req.params.source, 10);
    res.json(articles);
  } catch (err) {
    console.error('Error fetching by source:', err);
    res.status(500).json({ error: 'Failed to fetch articles by source' });
  }
};


const refreshNews = async (req, res) => {
  try {
    console.log('🔄 Manual news refresh triggered');
    await fetchNews(saveArticle);
    const articles = await fetchArticles();
    res.json({ message: 'News refreshed', articles });
  } catch (err) {
    console.error('Error refreshing news:', err);
    res.status(500).json({ error: 'Failed to refresh news' });
  }
};


const summarizeArticle = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

    const MAX_LEN = 1000;
    const cleanText = text.slice(0, MAX_LEN);
    const summary = await getSummary(cleanText);

    res.json({ summary });
  } catch (err) {
    console.error('Error summarizing article:', err);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
};


const summarizeAndSave = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !id) return res.status(400).json({ error: 'Text or ID missing' });

  try {
    const summary = await getSummary(text);
    const updated = await Article.findByIdAndUpdate(id, { summary }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Article not found' });
    res.json({ summary: updated.summary });
  } catch (err) {
    console.error('Error saving summary:', err);
    res.status(500).json({ error: 'Failed to generate and save summary' });
  }
};

module.exports = {
  getAllArticles,
  getArticlesBySource,
  refreshNews,
  summarizeArticle,
  summarizeAndSave,
  saveArticle,
  setMemoryStore,
};