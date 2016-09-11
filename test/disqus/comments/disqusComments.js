import { View } from '../../../index';
import { template } from '../../helpers';
import Handlebars from 'handlebars';
import path from 'path';

const DisqusComments = View.extend({
  template: template(path.join(__dirname, './disqusComments.html')),
  initialize(site) {
    this.site = site;
    Handlebars.registerPartial('disqusComments', this.template);
  },
  compile() {
    return this.template(this.site);
  }
});

export default new DisqusComments().compile();
