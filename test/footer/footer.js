import Fox, { Partial } from '../../index';
import Handlebars from 'handlebars';

const Footer = Partial.extend({
  name: 'Footer',
  template: Fox.loadTemplate('footer.html'),
  initialize() {
    Handlebars.registerPartial('footer', this.template);
  }
});

export default new Footer();
