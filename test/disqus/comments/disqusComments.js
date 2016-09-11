import Fox, { View } from '../../../index';
import Handlebars from 'handlebars';

const DisqusComments = View.extend({
  template: Handlebars.compile(Fox.loadTemplate('disqusComments.html')),
  initialize() {
    Handlebars.registerPartial('disqusComments', this.template);
  },
  compile() {
    return this.template();
  }
});

export default new DisqusComments().compile();
