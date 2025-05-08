const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticlesBySource,
  refreshNews,
  summarizeArticle,
  summarizeAndSave
} = require('../controllers/articleController');

router.get('/', getAllArticles);
router.get('/source/:source', getArticlesBySource);
router.post('/refresh', refreshNews);
router.post('/summarize', summarizeArticle);
router.patch('/:id/summary', summarizeAndSave);

module.exports = router;
