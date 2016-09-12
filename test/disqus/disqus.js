import Fox, { Partial } from '../../index';
import Handlebars from 'handlebars';
import path from 'path';

const Disqus = Partial.extend({
  template: Fox.loadTemplate('disqus.html'),
  initialize(site) {
    Handlebars.registerPartial('disqus', this.template);
  }
});

export default new Disqus();
