import { fs, path as nodePath } from '@/global';
import { Dirent } from 'fs';

export function getAllDirectoryList({ path }) {
  const readDir = path => {
    return fs.readdirSync(path, { withFileTypes: true }).map((fileDirent: Dirent) => ({
      path: nodePath.join(path, fileDirent.name),
      dirent: fileDirent,
    }));
  };
  const queue = [path];
  const directoryList = [];
  while (queue.length !== 0) {
    const readPath = queue.shift();
    const directoryFiles: Array<{ path: string; dirent: Dirent }> = readDir(readPath);
    directoryFiles.forEach(directoryItem => {
      if (directoryItem.dirent.isDirectory()) {
        directoryList.push(directoryItem.dirent.name);
        queue.push(directoryItem.path);
      }
    });
  }
  return directoryList;
}


const readDir = (path: string):any => {
  return new Promise((resolve1, reject1) => {
    fs.readdir(path, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject1(err);
      }
      resolve1(
        files.map((fileDirent: Dirent) => ({
            path: nodePath.join(path, fileDirent.name),
            dirent: fileDirent,
          }),
        ));
    });
  });
};

export async function scanBookDirectory({ path, accessExtension = ['.jpg', '.png'] }: { path: string, accessExtension: string[] }) {
  const queue = [path];
  const directoryList = [];
  while (queue.length !== 0) {
    const readPath = queue.shift();
    // get dir content
    const directoryFiles: Array<{ path: string; dirent: Dirent }> = await readDir(readPath);
    const targetFiles = [];

    // scan dir content
    for (const directoryItem of directoryFiles) {
      if (directoryItem.dirent.isDirectory()) {
        queue.push(directoryItem.path);
      }
      if (
        directoryItem.dirent.isFile() &&
        accessExtension.find((accessExtension: string) => nodePath.extname(directoryItem.dirent.name).toLowerCase() === accessExtension.toLowerCase()) != undefined
      ) {
        targetFiles.push({path:directoryItem.path})
      }

    }
    if (targetFiles.length > 5){
      directoryList.push({
        path: readPath,
        name: nodePath.basename(readPath),
        targetFiles,
      })
    }
  }
  return directoryList;
}


