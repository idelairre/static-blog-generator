import Handlebars from 'handlebars';
import path from 'path';
import Fox, { CollectionView } from '../../index';
import Post from './post/post';

const Posts = CollectionView.extend({
	path: '/',
	template: Handlebars.compile(Fox.loadTemplate('posts.html')),
	item: Post,
	initialize(posts) {
		Handlebars.registerPartial('post', this.item.prototype.template);
		this.posts = posts.map(post => {
			post.atPost = false;
			post.content = post.excerpt;
			return post;
		});
	},
	compile() {
		return this.template({
			posts: this.posts
		});;
	}
})

export default Posts;
