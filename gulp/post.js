import fs from 'fs';
import gulp from 'gulp';
import { argv } from 'yargs';
import rfc822Date from 'rfc822-date';
import config from '../test/config';

const today = new Date();

gulp.task('post', cb => {
  const filename = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}-${argv.title}.markdown`;
  const metadata =
`---
layout: post
author: ${config.author}
title: "${argv.title}"
date: ${rfc822Date(today)}
comments: ${typeof argv.comments !== 'undefined' ? argv.comments : true}
categories: ${typeof argv.categories !== 'undefined' ? argv.categories : ''}
---`
  fs.writeFileSync(`./test/posts/_posts/${filename}`, metadata, 'utf8')
  cb();
});
