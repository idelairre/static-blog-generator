import _ from 'lodash';
import { View } from '../../index';
import { template } from '../helpers';
import Handlebars from 'handlebars';
import path from 'path';

const helpers = require('handlebars-helpers')();

const Header = View.extend({
  template: template(path.join(__dirname, './header.html')),
  initialize() {
    Handlebars.registerPartial('header', this.template);
  },
  compile() {
    return this.template(this.site);
  }
});

export default new Header().compile();
