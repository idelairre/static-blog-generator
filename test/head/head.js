import Fox, { View } from '../../index';
import Handlebars from 'handlebars';

const Head = View.extend({
  template: Handlebars.compile(Fox.loadTemplate('head.html')),
  initialize() {
    Handlebars.registerPartial('head', this.template);
  },
  compile() {
    return this.template();
  }
});

export default new Head().compile();
