const TurndownService = require('turndown');
const turndownPluginGfm = require('joplin-turndown-plugin-gfm');
const gfm = turndownPluginGfm.gfm;
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

turndownService.use(gfm);

turndownService.addRule('br', {
  filter: ['br', '<br>'],
  replacement: () => '\n',
});
module.exports = {
  turndownService,
};
