import fs from 'fs';
import gulp from 'gulp';
import { kebabCase } from 'lodash';
import { argv } from 'yargs';
import config from '../test/config';

const today = new Date();

gulp.task('post', cb => {
  const filename = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}-${kebabCase(argv.title)}.markdown`;
  const metadata =
`---
layout: post
author: ${config.author}
title: "${argv.title}"
date: ${today.toISOString()}
comments: ${typeof argv.comments !== 'undefined' ? argv.comments : true}
categories: ${typeof argv.categories !== 'undefined' ? argv.categories : ''}
---`
  fs.writeFileSync(`./test/posts/_posts/${filename}`, metadata, 'utf8')
  cb();
});
