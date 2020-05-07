// @ts-ignore
import nodePath from 'path';
import nodeFSD from 'fs';
import formData from 'form-data';
import http from 'http';
import url from 'url';
import jimpD from 'jimp';

export const electron = window.require('electron');
export const remote = electron.remote;
export const jimp: typeof jimpD = remote.require('jimp');
export const directoryTree = remote.require('directory-tree');
export const crypto = remote.require('crypto');
export const path: typeof nodePath = remote.require('path');
export const fs: typeof nodeFSD = remote.require('fs');
export const mkdirp = remote.require('mkdirp');
export const nodeFormData: typeof formData = remote.require('form-data');
export const nodeHttp: typeof http = remote.require('http');
export const nodeURL: typeof url = remote.require('url');
export const app = remote.app;
export const applicationTempPath = path.dirname(app.getPath('temp')) + '/youcomic';
export const projectPathConfig = {
  projectPagesDirectory: 'pages',
  projectThumbnailsDirectory: 'thumbnails',
};

