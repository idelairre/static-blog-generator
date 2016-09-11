import gulp from 'gulp';
import path from 'path';
import { exec } from 'child_process';
import util, { log } from 'gulp-util';

const repoPath = path.join(__dirname, '..', '../idelairre.github.io/');

const getLastCommit = callback => {
  exec('git log -1 --pretty=oneline', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    return callback(stdout);
  });
}

const cmd = commit => `git add . && git commit -m "${commit.trim()}"`;

const gitAdd = (commit, cb) => {
  exec(cmd(commit), {
    cwd: repoPath,
    stdio: [process.stdin, 'pipe', 'pipe']
  }, (error, stdout, stderr) => {
    if (error) {
      return cb(error)
    }
    if (stderr) {
      return cb(stderr);
    }
    if (stdout) {
      cb(stderr)
    }
  });
}

const gitPush = (err, msg) => {
  if (err) {
    log(util.colors.red(err.toString().trim()));
    log('Attempting to run git push...');
  }
  exec('git push origin master', {
    cwd: repoPath,
    stdio: [process.stdin, 'pipe', 'pipe']
  }, (error, stdout, stderr) => {
    if (error) {
      log(util.colors.red(error));
      return;
    }
    if (stderr) {
      if (stderr.toString().match(/Everything up-to-date/)) {
        log(stderr);
        return;
      }
      log(util.colors.red(stderr));
      return;
    }
    if (stdout) {
      log(stdout);
    }
  });
}

gulp.task('deploy', ['copy'], cb => {
  getLastCommit(commit => {
    gitAdd(commit, gitPush);
  });
  cb();
});
