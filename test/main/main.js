import Fox, { View } from '../../index';
import Handlebars from 'handlebars';

const Index = View.extend({
	path: '/',
	template: Handlebars.compile(Fox.loadTemplate('main.html')),
	initialize(data) {
		this.data = data;
	},
	compile() {
		return this.template(this.data);
	}
});

export default Index;
