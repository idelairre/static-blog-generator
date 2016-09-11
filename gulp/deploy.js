import gulp from 'gulp';
import path from 'path';
import { exec } from 'child_process';

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

const cmd = commit => `git add -A . && git commit -a -m "${commit.trim()} && git push origin master"`;

const gitPush = commit => {
  exec(cmd(commit), {
    cwd: repoPath,
    stdio: [process.stdin, 'pipe', 'pipe']
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
}

gulp.task('deploy', cb => {
  getLastCommit(gitPush);
  cb();
});
