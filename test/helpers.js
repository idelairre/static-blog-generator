import { kebabCase } from 'lodash';
import fs from 'fs-extra';
import he from 'he';
import marked from 'marked';
import path from 'path';
import Handlebars from 'handlebars';

export const compile = markdown => {
	return marked(markdown.replace(/---([\s\S]*)---/m, ''))
}

export const readFile = function(filepath) {
	return fs.readFileSync(filepath, 'utf8');
}

export const xml = function(filepath) {
	const templ = readFile(filepath);
	return Handlebars.compile(templ);
}

export const parseMetaData = post => {
	let data;
	const json = {};
	const match = post.match(/---([\s\S]*)---/m);
	if (match) {
		data = match[0].replace(/---/g, '');
	}
	if (data) {
		data = data.split('\n').map(item => {
			const splitLine = item.split(':');
			const key = splitLine[0].trim();
			if (key !== '') {
				json[key] = item.replace(new RegExp(`${key}:`), '').replace(/"/g, '').trim();
			}
		});
	}
	return json;
}

export const parsePost = (file, filepath) => {
	let post;
	if (filepath) {
		post = fs.readFileSync(`${filepath}/${file}`, 'utf8');
	} else {
		post = fs.readFileSync(file, 'utf8');
	}
	const data = parseMetaData(post);
	data.path = file;
	data.url = `/${kebabCase(data.title)}`
	data.html = he.decode(compile(post.replace(/---([\s\S]*)---/m, '')));
	if (data.html.includes('<!-- more -->')) {
		data.excerpt = data.html.replace(/---([\s\S]*)---/m, '').match(/([\s\S]*)<!-- more -->/m)[0].replace(/<!-- more -->/g, '');
	}
	return data;
}

export const parsePosts = filepath => {
	const postsPath = path.join(__dirname, filepath);
	const postsJson = fs.readdirSync(postsPath).map(post => parsePost(post, postsPath));
	return postsJson;
}

export const getPost = (name, posts) => {
	for (let i = 0; i < posts.length; i += 1) {
		if (posts[i].path === name) {
			return posts[i];
		}
	}
}
