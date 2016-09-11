import { kebabCase } from 'lodash';
import db from './db';
import fs from 'fs-extra';
import path from 'path';
import Fox, { Compiler } from '../index';
import Handlebars from 'handlebars';
import Disqus from './disqus/disqus';
import DisqusComments from './disqus/comments/disqusComments';
import Post from './posts/post/post';
import Posts from './posts/posts';
import Main from './main/main';
import { getDir, getPost, readFile, parseMetaData, parsePost, parsePosts, template } from './helpers';
import site from './config';
import './footer/footer';
import './head/head';
import './header/header';

const copyCss = filepath => {
	fs.copySync(path.join(__dirname, filepath), './dist/css');
}

const copyImages = filepath => {
	fs.copySync(path.join(__dirname, filepath), './dist/images');
}

const copyAssets = () => {
	copyCss('./css');
	copyImages('./images');
}

Fox.configure({
	output: './dist',
	site
});

const compiler = Compiler.extend({
	routes: {
		'/': 'index',
		'/:post': 'post',
		'/about': 'about',
		'/portfolio': 'portfolio'
	},
	build() {
		Object.keys(this.routes).forEach(key => {
			if (this.routes[key] === 'post') {
				const posts = parsePosts('./posts/_posts').reverse();
				posts.forEach(post => {
					post.content = post.html;
					post.atPost = true;
					fs.writeFileSync(`${Fox.output}/${kebabCase(post.title)}.html`, this[this.routes[key]](post), 'utf8');
				});
			} else {
				fs.writeFileSync(`${Fox.output}/${this.routes[key]}.html`, this[this.routes[key]](), 'utf8');
			}
		});
	},
	async buildPost(buildPath) {
		const pathSep = path.parse(buildPath).dir.split(path.sep);
		const postTitle = path.parse(buildPath).name.replace(/[-\d]/g, '').trim();
		const key = `/${pathSep[pathSep.length - 1]}`;
		if (key === '/_posts') {
			const post = parsePost(buildPath);
			await db.update({ title: postTitle }, post, {});
			post.content = post.html;
			post.atPost = true;
			Fox.build(`${kebabCase(post.title)}.html`, this.post(post));
			Fox.build('index.html', this.index(await db.find({}).sort({ date: -1 })));
		} else if (this.routes[key]) {
			Fox.build(`${this.routes[key]}.html`, this[this.routes[key]]());
		}
	},
	compile(buildPath) {
		copyAssets();
		if (!buildPath || getDir(buildPath) === path.parse(__dirname).base) { // build everything
			this.build();
		} else if (path.parse(buildPath).dir !== path.parse(__dirname).dir) {
			this.buildPost(buildPath);
		}
	},
	about() {
		const page = parseMetaData(readFile(path.join(__dirname, './about/about.markdown')));
		const content = Object.assign({ site }, { page }, {
			content: template(path.join(__dirname, './about/about.markdown'))
		});
		return new Main(content).compile();
	},
	index(posts = parsePosts('./posts/_posts').reverse()) {
		const postViews = new Posts(posts);
		const page = { title: '' };
		const content = Object.assign({ site }, { page }, {
			content: postViews.compile()
		});
		return new Main(content).compile();
	},
	portfolio() {
		const page = parseMetaData(readFile(path.join(__dirname, './portfolio/portfolio.html')));
		const content = Object.assign({ site }, { page }, {
			content: template(path.join(__dirname, './portfolio/portfolio.html'))
		});
		return new Main(content).compile();
	},
	post(post) {
		const postView = new Post(post);
		const page = {
			url: `${site.url}/${kebabCase(post.title)}`
		};
		const content = Object.assign({ site }, { page }, {
			content: postView.compile()
		});
		return new Main(content).compile();
	}
});

const compilerInst = new compiler();

export default compilerInst;
