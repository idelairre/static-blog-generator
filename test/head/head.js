import { View } from '../../index';
import { template } from '../helpers';
import Handlebars from 'handlebars';
import path from 'path';

const Head = View.extend({
  template: template(path.join(__dirname, './head.html')),
  initialize() {
    Handlebars.registerPartial('head', this.template);
  },
  compile() {
    return this.template(this.site);
  }
});

export default new Head().compile();
