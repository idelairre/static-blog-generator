import _, { pick, kebabCase } from 'lodash';
import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';

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
		if (typeof options === 'object' && typeof this.path === 'string') {
			const item = options;
			parsePath(this.path, item);
		}

		if (typeof this.initialize === 'function') {
			this.initialize.apply(this, arguments);
		}
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
			this.router = options.routes;
			this.data = options.data;
		}

		this.initialize.apply(this, arguments);
		this.compile.apply(this, arguments);
	}

	initialize() {}

	compile() {}

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
	globber: require('glob-fs')(),
	View,
	CollectionView,
	templates: [],
	views: [],
	output: './dist',
	build(filepath, content) {
		fs.writeFileSync(`${this.output}/${filepath}`, content, 'utf8');
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
		this.output = path.join(__dirname, config.output);
		this.site = config.site;
	},
	compile() {
		fs.ensureDirSync(this.output);
	}
};

export default Fox;
