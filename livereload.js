import livereload from 'livereload';
import chokidar from 'chokidar';
import path from 'path';
import { exec } from 'child_process';
import compiler from './test/app';
import Fox from './index';

Fox.debug = true;

const server = () => {
    exec('http-server -c-1 ./dist', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
}

const watcher = chokidar.watch('test', {
  ignored: /[\/\\]\./,
  persistent: true
});

watcher
  // .on('add', filePath => Fox.log(`File ${filePath} has been added`))
  .on('change', filePath => Fox.log(`File ${filePath} has been changed`))
  .on('unlink', filePath => Fox.log(`File ${filePath} has been removed`));

watcher.on('change', (filePath, stats) => {
  if (stats) {
    const absPath = path.join(__dirname, filePath)
    Fox.log(`File ${filePath} changed size to ${stats.size}`);
    compiler.compile(absPath);
  }
});

const lr = livereload.createServer();

lr.watch(`${__dirname}/dist`);

server();
