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
export function scanBookDirectory({ path, accessExtension = ['.jpg', '.png'] }) {
  return new Promise((resolve, reject) => {
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
          queue.push(directoryItem.path);
          // scan files
          const targetFiles = [];
          fs.readdirSync(directoryItem.path, { withFileTypes: true }).forEach(
            (fileDirent: Dirent) => {
              if (
                fileDirent.isFile() &&
                accessExtension.find(
                  accessExtension =>
                    nodePath.extname(fileDirent.name).toLowerCase() ===
                    accessExtension.toLowerCase()
                ) !== undefined
              ) {
                targetFiles.push({
                  path: nodePath.join(directoryItem.path, fileDirent.name),
                });
              }
            }
          );
          directoryList.push({
            path: directoryItem.path,
            name: directoryItem.dirent.name,
            targetFiles,
          });
        }
      });
    }
    resolve(directoryList);
  });
}
