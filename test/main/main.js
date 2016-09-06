import { View } from '../../index';
import { template } from '../helpers';
import path from 'path';

const Index = View.extend({
	path: '/',
	template: template(path.join(__dirname, './main.html')),
	initialize(data) {
		this.data = data;
	},
	compile() {
		return this.template(this.data);
	}
});

export default Index;
