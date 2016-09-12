import Fox, { Partial } from '../../index';
import Handlebars from 'handlebars';

const Footer = Partial.extend({
  name: 'Footer',
  template: Handlebars.compile(Fox.loadTemplate('footer.html')),
  initialize() {
    Handlebars.registerPartial('footer', this.template);
  },
  compile() {
    return this.template();
  }
});

export default new Footer().compile();
