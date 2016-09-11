import Fox, { View } from '../../index';
import Handlebars from 'handlebars';
import path from 'path';

const Footer = View.extend({
  template: Handlebars.compile(Fox.loadTemplate('footer.html')),
  initialize() {
    Handlebars.registerPartial('footer', this.template);
  },
  compile() {
    return this.template();
  }
});

export default new Footer().compile();
