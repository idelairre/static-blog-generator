import { View } from '../../index';
import { template } from '../helpers';
import Handlebars from 'handlebars';
import path from 'path';

const Disqus = View.extend({
  template: template(path.join(__dirname, './disqus.html')),
  initialize(site) {
    this.site = site;
    Handlebars.registerPartial('disqus', this.template);
  },
  compile() {
    return this.template(this.site);
  }
});

export default new Disqus().compile();
