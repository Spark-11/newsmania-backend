const { JSDOM } = require('jsdom');

function cleanHTML(html) {
  const dom = new JSDOM('<!DOCTYPE html>');
  const div = dom.window.document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

module.exports = { cleanHTML };
