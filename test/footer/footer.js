import { View } from '../../index';
import { template } from '../helpers';
import Handlebars from 'handlebars';
import path from 'path';

const Footer = View.extend({
  template: template(path.join(__dirname, './footer.html')),
  initialize() {
    Handlebars.registerPartial('footer', this.template);
  },
  compile() {
    return this.template(this.site);
  }
});

export default new Footer().compile();
