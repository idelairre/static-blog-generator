import Fox, { Partial } from '../../index';
import Handlebars from 'handlebars';

const helpers = require('handlebars-helpers')();

const Header = Partial.extend({
  name: 'Header',
  template: Fox.loadTemplate('header.html'),
  initialize() {
    Handlebars.registerPartial('header', this.template);
  }
});

export default new Header();
