const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
const Article = require('../models/Article');
const { cleanHTML } = require('../utils/domCleaner');

const parser = new Parser({
  customFields: {
    item: ['description', 'content:encoded']
  },
  strict: false
});
const RSS_FEEDS = {
  'ABP Live': 'https://news.abplive.com/news/india/feed',
  'Amar Ujala': 'https://www.amarujala.com/rss/breaking-news.xml'
};

async function fetchNews(saveArticleFn) {
  for (const [source, url] of Object.entries(RSS_FEEDS)) {
    const feed = await parser.parseURL(url);
    for (const item of feed.items.slice(0, 10)) {
      const content = item.contentSnippet || item.content || item.description || item.title;
      const cleanContent = cleanHTML(content);
      await saveArticleFn({
        title: item.title,
        link: item.link,
        content: cleanContent,
        source,
        publishDate: item.pubDate
      });
    }
  }
}

module.exports = { fetchNews };