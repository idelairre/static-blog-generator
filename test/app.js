import { kebabCase } from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import Fox, { Compiler } from '../index';
import Handlebars from 'handlebars';
import Disqus from './disqus/disqus';
import DisqusComments from './disqus/comments/disqusComments';
import Footer from './footer/footer';
import Post from './posts/post/post';
import Posts from './posts/posts';
import Head from './head/head';
import Header from './header/header';
import Main from './main/main';
import { getDir, readFile, parseMetaData, parsePosts, template } from './helpers';
import site from './config';

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

new Disqus().compile();
new DisqusComments().compile();

// fs.writeFile('./posts/posts.json', JSON.stringify(posts));

const HeadView = new Head().compile();
const HeaderView = new Header().compile();
const FooterView = new Footer().compile();

Fox.configure({
	output: './dist',
	site
});

const compiler = Compiler.extend({
	data: {
		posts: parsePosts('./posts/_posts').reverse()
	},
	routes: {
		'/': 'index',
		'/:post': 'post',
		'/about': 'about',
		'/portfolio': 'portfolio'
	},
	compile(buildPath) {
		copyAssets();
		if (!buildPath || getDir(buildPath) === path.parse(__dirname).base) {
			Object.keys(this.routes).forEach(key => {
				if (this.routes[key] === 'post') {
					this.data.posts.forEach(post => {
						post.content = post.html;
						post.atPost = true;
						fs.writeFileSync(`${Fox.output}/${kebabCase(post.title)}.html`, this[this.routes[key]](post), 'utf8');
					});
				} else {
					fs.writeFileSync(`${Fox.output}/${this.routes[key]}.html`, this[this.routes[key]](), 'utf8');
				}
			});
		} else if (path.parse(buildPath).dir !== path.parse(__dirname).dir) {
			const pathSep = path.parse(buildPath).dir.split(path.sep);
			const key = `/${pathSep[pathSep.length - 1]}`;
			console.log('[STATIC FOX] checking route: ', key, this.routes);
			if (this.routes[key]) {
				fs.writeFileSync(`${Fox.output}/${this.routes[key]}.html`, this[this.routes[key]](), 'utf8');
				console.log('[STATIC FOX] building route: ', key);
			}
		}
	},
	about() {
		const page = parseMetaData(readFile(path.join(__dirname, './about/about.markdown')));
		const content = Object.assign({ site }, { page }, {
			content: template(path.join(__dirname, './about/about.markdown'))
		});
		return new Main(content).compile();
	},
	index() {
		const postViews = new Posts(this.data.posts);
		const content = Object.assign({ site }, {
			content: postViews.compile()
		});
		return new Main(content).compile();
	},
	portfolio() {
		const page = parseMetaData(readFile(path.join(__dirname, './portfolio/portfolio.html')));
		const content = Object.assign({ site }, {
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
