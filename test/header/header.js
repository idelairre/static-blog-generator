import Fox, { View } from '../../index';
import Handlebars from 'handlebars';

const helpers = require('handlebars-helpers')();

const Header = View.extend({
  template: Handlebars.compile(Fox.loadTemplate('header.html')),
  initialize() {
    Handlebars.registerPartial('header', this.template);
  },
  compile() {
    return this.template();
  }
});

export default new Header().compile();
