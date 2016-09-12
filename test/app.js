import { kebabCase } from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import Fox, { Compiler, RSS } from '../index';
import Handlebars from 'handlebars';
import Post from './posts/post/post';
import Posts from './posts/posts';
import Main from './main/main';
import { compile, getPost, readFile, parseMetaData, parsePost, parsePosts, xml } from './helpers';
import site from './config';
import './disqus/disqus';
import './disqus/comments/disqusComments';
import './footer/footer';
import './head/head';
import './header/header';

Fox.configure({
	debug: true,
	input: './test',
	output: './dist',
	site
});

const posts = parsePosts('./posts/_posts').reverse();

const compiler = Compiler.extend({
	assets: {
		images: {
			pattern: /\.(jpe?g|png|gif|svg)$/, path: './images'
		}
	},
	collections: {
		posts: {
			key: 'title',
			items: posts,
			parser: parsePost,
			path: './posts/_posts'
		}
	},
	routes: {
		'/': 'index',
		'/:post': 'post',
		'/about': 'about',
		'/portfolio': 'portfolio'
	},
	about() {
		const page = parseMetaData(Fox.loadTemplate('about.markdown'));
		const content = Fox.content({ page }, {
			content: compile(Fox.loadTemplate('about.markdown'))
		});
		return new Main(content).compile();
	},
	index(posts = parsePosts('./posts/_posts').reverse()) {
		const postViews = new Posts(posts);
		const page = { title: '' };
		const content = Fox.content({ page }, {
			content: postViews.compile()
		});
		return new Main(content).compile();
	},
	portfolio() {
		const page = parseMetaData(Fox.loadTemplate('portfolio.html'));
		const content = Fox.content({ page }, {
			content: compile(Fox.loadTemplate('portfolio.html'))
		});
		return new Main(content).compile();
	},
	post(post) {
		const postView = new Post(post);
		const page = {
			url: `${site.url}/${kebabCase(post.title)}`
		};
		const content = Fox.content({ page }, {
			content: postView.compile()
		});
		return new Main(content).compile();
	}
});

const rss = new RSS({
	output: 'feed.xml',
	feed: xml(path.join(__dirname, './feed/feed.xml'))(Fox.content({ posts }))
});

const compilerInst = new compiler();

export default compilerInst;
