import _, { pick, kebabCase } from 'lodash';
import Handlebars from 'handlebars';
import fs from 'fs-extra';
import inflection from 'inflection';
import path from 'path';

const getDir = filepath => {
	const dirPath = path.parse(filepath).dir.split(path.sep);
	return dirPath[dirPath.length - 1];
}

const extend = function(protoProps, staticProps) {
	const parent = this;
	let child;

	if (protoProps && {}.hasOwnProperty.call(protoProps, 'constructor')) {
		child = protoProps.contructor;
	} else {
		child = function () {
			return parent.apply(this, arguments);
		}
	}

	_.extend(child, parent, staticProps);

	child.prototype = _.create(parent.prototype, protoProps);
	child.prototype.constructor = child;

	child.__super__ = parent.prototype;

	return child;
}

const parsePath = (path, object) => {
	const splitPath = path.split('/');
	const parsedPath = splitPath.map(item => {
		const key = item.replace(/:/g, '');
		if (object.hasOwnProperty(key) && key === 'date') {
			return kebabCase(object[key].substring(0, 10));
		} else if (object.hasOwnProperty(key)) {
			return kebabCase(object[key]);
		}
	}).join('/');
	return parsedPath;
}

export class View {
	constructor(options) {
		if (typeof this.initialize === 'function') {
			this.initialize.apply(this, arguments);
		}
	}
}

export class Partial extends View {
	constructor(options) {
		super(options);
		this._addToPartials();
	}

	_addToPartials() {
		Fox.partials[this.name] = this.constructor;
	}
}

View.extend = extend;

export class CollectionView extends View {
	constructor(options) {
		super(options);
	}
}

const optionalParam = /\((.*?)\)/g;
const namedParam = /(\(\?)?:\w+/g;
const splatParam = /\*\w+/g;
const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
const routeStripper = /^[#\/]|\s+$/g;
const rootStripper = /^\/+|\/+$/g;
const pathStripper = /#.*$/;

export class Compiler {
	constructor(options) {
		if (options) {
			this.collections = options.collections;
			this.router = options.routes;
			this.assets = options.assets;
		}
		this._copyAssets();
		this.initialize.apply(this, arguments);
		this.compile.apply(this, arguments);
	}

	initialize() {}

	_buildAll() {
		Object.keys(this.routes).forEach(route => {
			if (!route.match(/:/)) { // its not a collection
				Fox.log(`building route "${route}"`);
				Fox.build(`${this.routes[route]}.html`, this[this.routes[route]]());
			} else {
				const collection = inflection.pluralize(route.replace(/\/:/, ''));
				this.collections[collection].items.forEach(item => {
					Fox.log(`building ${inflection.singularize(collection)}: "${item.title}"`);
					Fox.build(`${kebabCase(item.title)}.html`, this[this.routes[route]](item));
				});
			}
		});
	}

	// _buildPartials(buildPath) {
	// 	const name = path.parse(buildPath).name;
	// 	Object.keys(Fox.partials).forEach(partial => {
	// 		if (partial.toLowerCase() === name) {
	// 			new Fox.partials[partial]();			}
	// 	});
	// }

	_buildCollections(buildPath) {
		const itemTitle = path.parse(buildPath).name.replace(/[-\d]/g, '').trim();
		const route = path.parse(buildPath).name;
		Object.keys(this.collections).forEach(collection => {
			const collectionPath = this.collections[collection].path.replace(/./, '');
			if (buildPath.includes(collectionPath)) {
				const name = inflection.singularize(collection);
				const item = this.collections[collection].parser(buildPath);
				Fox.log(`lol building ${name}: "${item[this.collections[collection].key]}"`)
				Fox.build(`${kebabCase(item[this.collections[collection].key])}.html`, this[name](item));
				Fox.build('index.html', this.index());
			} else if (this[route]) { // if its not a collection, get the route from the filename
				Fox.build(`${route}.html`, this[route]());
			} else { // its probably a partial, build it and build everything
				// this._buildPartials(buildPath);
				this._buildAll();
			}
		});
	}

	compile(buildPath) {
		const compilerPath = path.parse(__dirname).base;
		const compilerDir = path.parse(__dirname).dir;
		if (!buildPath || getDir(buildPath) === compilerPath) { // if the file changed in the root directory, build everything
			this._buildAll();
		} else if (path.parse(buildPath).dir !== compilerDir) { // otherwise check if its a collection
			this._buildCollections(buildPath);
		}
	}

	_copyAssets() {
		const globber = require('glob-fs')();
		Object.keys(this.assets).forEach(asset => {
			const files = globber.readdirSync(`${Fox.input}/**/*`, {}).filter(file => this.assets[asset].pattern.test(file));
			files.forEach(file => {
				fs.copySync(file, `${Fox.outputAbsolute}/${this.assets[asset].path}/${path.parse(file).base}`)
			});
		});
	}

	_routeToRegExp(route) {
		route = route.replace(escapeRegExp, '\\$&')
								 .replace(optionalParam, '(?:$1)')
								 .replace(namedParam, (match, optional) => {
									 return optional ? match : '([^/?]+)';
								 })
								 .replace(splatParam, '([^?]*?)');
		return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	}

	_extractParameters(route, fragment) {
		const params = route.exec(fragment).slice(1);
		return params.map((param, i) => {
			if (i === params.length) {
				return param || null;
			}
			return param;
		})
	}
}

Compiler.extend = extend;

const Fox = {
	css: [],
	globber: require('glob-fs')(),
	debug: false,
	log(...args) {
		args.unshift('[STATIC FOX]');
		this.debug ? console.log.call(console, ...args) : Function.prototype;
	},
	View,
	CollectionView,
	templates: [],
	views: [],
	partials: {},
	output: './dist',
	content(...args) {
		if (this.css.length === 0) {
			this.compileCss();
		}
		return Object.assign({ site: this.site }, { css: this.css }, ...args)
	},
	build(filepath, content) {
		fs.writeFileSync(`${this.outputAbsolute}/${filepath}`, content, 'utf8');
	},
	compileCss() {
		const files = this.globber.readdirSync('**/*.css', {}).filter(file => !path.parse(file).dir.match(/dist/) && file.match(/\.css$/));
		files.forEach(file => {
			fs.copySync(file, `${Fox.outputAbsolute}/css/${path.parse(file).base}`)
		});
		const distFiles = this.globber.readdirSync('dist/css/*.css', {}).filter(file => {
			return !path.parse(file).dir.match(new RegExp(this.input)) && file.match(/\.css$/);
		}).map(file => {
			return file.replace(new RegExp(path.parse(this.output).base), '');
		});
		this.css = _.union(this.css, distFiles);
	},
	compileViews() {
		this.compileTemplates();
		this.compileMarkdown();
		this.templates = this.templates.filter(file => !path.parse(file).dir.match(/dist/));
	},
	compileTemplates() {
		const files = this.globber.readdirSync('**/*.html', {})
		this.templates = _.union(this.templates, files)
	},
	compileMarkdown() {
		const files = this.globber.readdirSync('**/*.markdown', {});
		this.templates = _.union(this.templates, files);
	},
	loadTemplate(file) {
		if (this.templates && this.templates.length > 0) {
			for (let i = 0; i < this.templates.length - 1; i += 1) {
				const templ = this.templates[i];
				if (path.parse(templ).base === file) {
					return fs.readFileSync(templ, 'utf8');
				}
			}
		} else {
			this.compileViews();
			return this.loadTemplate(file);
		}
	},
	configure(config) {
		this.input = path.parse(config.input).base;
		this.inputAbsolute = path.join(__dirname, config.input);

		this.output = config.output;
		this.outputAbsolute = path.join(__dirname, config.output);

		this.site = config.site;
		this.debug = config.debug;
	},
	compile() {
		fs.ensureDirSync(this.output);
	}
};

export default Fox;
