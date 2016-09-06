import { View } from '../../index';
import { template } from '../helpers';
import Handlebars from 'handlebars';
import path from 'path';

const Header = View.extend({
  template: template(path.join(__dirname, './header.html')),
  initialize(site) {
    this.site = site;
    Handlebars.registerPartial('header', this.template);
  },
  compile() {
    return this.template(this.site);
  }
});

export default Header;
