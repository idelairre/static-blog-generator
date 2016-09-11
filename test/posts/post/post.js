import path from 'path';
import Handlebars from 'handlebars';
import { parsePosts, readFile } from '../../helpers';
import Fox, { CollectionView, View } from '../../../index';

Handlebars.registerPartial('postFooter', Fox.loadTemplate('postFooter.html'));

const Post = View.extend({
	template: Handlebars.compile(Fox.loadTemplate('post.html')),
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
