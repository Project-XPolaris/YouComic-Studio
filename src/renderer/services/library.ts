import { fs } from '@/global';

export interface LibraryExportConfig {
  name: string,
  books: Array<{
    name: string,
    path: string,
    cover:string,
    pages: Array<{
      order: number,
      path: string,
    }>,
    tags: Array<{
      name: string,
      type: string,
    }>,
    uuid:string
  }>
}

export const saveLibraryExportConfigFile = async ({ config, savePath }:{config:LibraryExportConfig,savePath:string}) => {
  await fs.writeJSON(savePath, config);
};
