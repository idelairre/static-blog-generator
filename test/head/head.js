import Fox, { Partial } from '../../index';
import Handlebars from 'handlebars';

const Head = Partial.extend({
  name: 'Head',
  template: Fox.loadTemplate('head.html'),
  initialize() {
    Handlebars.registerPartial('head', this.template);
  }
});

export default new Head();
