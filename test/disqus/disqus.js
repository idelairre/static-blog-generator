import Fox, { View } from '../../index';
import Handlebars from 'handlebars';
import path from 'path';

const Disqus = View.extend({
  template: Handlebars.compile(Fox.loadTemplate('disqus.html')),
  initialize(site) {
    this.site = site;
    Handlebars.registerPartial('disqus', this.template);
  },
  compile() {
    return this.template(this.site);
  }
});

export default new Disqus().compile();
