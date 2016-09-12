import Fox, { Partial } from '../../../index';
import Handlebars from 'handlebars';

const DisqusComments = Partial.extend({
  template: Fox.loadTemplate('disqusComments.html'),
  initialize() {
    Handlebars.registerPartial('disqusComments', this.template);
  }
});

export default new DisqusComments();
