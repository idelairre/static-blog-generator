import Handlebars from 'handlebars';
import path from 'path';
import Fox, { CollectionView } from '../../index';
import { template } from '../helpers';
import Post from './post/post';

const Posts = CollectionView.extend({
	path: '/',
	template: template(path.join(__dirname, './posts.html')),
	item: Post,
	initialize(posts) {
		Handlebars.registerPartial('post', this.item.prototype.template);
		this.posts = posts.map(post => {
			post.content = post.excerpt;
			return post;
		});
	},
	compile() {
		const view = this.template({ posts: this.posts });
		Handlebars.registerPartial('posts', view);
		return view;
	}
})

export default Posts;
