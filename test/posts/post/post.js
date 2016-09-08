import path from 'path';
import Handlebars from 'handlebars';
import { parsePosts, readFile, template } from '../../helpers';
import Fox, { CollectionView, View } from '../../../index';

Handlebars.registerPartial('postFooter', template(path.join(__dirname, './footer/postFooter.html')));

const Post = View.extend({
	template: template(path.join(__dirname, './post.html')),
	initialize(post) {
		this.post = post;
	},
	compile() {
		return this.template({
			post: this.post,
			site: Fox.site
		 });
	}
})

export default Post;
