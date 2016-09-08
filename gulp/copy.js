import fs from 'fs-extra';
import gulp from 'gulp';

const repoPath = '../idelairre.github.io';

gulp.task('copy', cb => {
  fs.copySync('./dist', repoPath);
  cb();
});
