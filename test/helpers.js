import { kebabCase } from 'lodash';
import fs from 'fs-extra';
import he from 'he';
import marked from 'marked';
import path from 'path';
import Handlebars from 'handlebars';

export const compile = markdown => {
	return marked(markdown);
}

export const readFile = filepath => {
	return fs.readFileSync(filepath, 'utf8');
}

export const template = function(filepath) {
		const name = path.parse(filepath).name;
		const ext = path.parse(filepath).ext;
		const templ = ext.includes('html') ? readFile(filepath) : compile(readFile(filepath).replace(/---([\s\S]*)---/m, ''));
		return Handlebars.compile(templ);
}

export const parseMetaData = post => {
	const json = {};
	let data = post.match(/---([\s\S]*)---/m)[0].replace(/---/g, '');
	data = data.split('\n').map(item => {
		const splitLine = item.split(':');
		const key = splitLine[0].trim();
		if (key !== '') {
			json[key] = item.replace(new RegExp(`${key}:`), '').replace(/"/g, '').trim();
		}
	});
	return json;
}

export const parsePosts = filepath => {
	const postsPath = path.join(__dirname, filepath);
	const postsJson = fs.readdirSync(postsPath).map(file => {
		const post = fs.readFileSync(`${postsPath}/${file}`, 'utf8');
		const data = parseMetaData(post);
		data.url = `/${kebabCase(data.title)}`
		data.html = he.decode(compile(post.replace(/---([\s\S]*)---/m, '')));
		data.excerpt = data.html.replace(/---([\s\S]*)---/m, '').match(/([\s\S]*)<!-- more -->/m)[0].replace(/<!-- more -->/g, '');
		return data;
	});
	return postsJson;
}
