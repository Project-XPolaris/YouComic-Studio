import { CreateBookModelStateType, Page } from '@/pages/Create/model';

export const getCurrentDisplayPageSrc = (create: CreateBookModelStateType) => {
  if (create.pages === undefined || create.pages.length === 0) {
    return undefined;
  }
  return create.pages.find((page: Page) => page.name === create.currentImageName)?.path;
};
export const getImageWidth = (create: CreateBookModelStateType) => {
  if (create.currentImageName === undefined || create.currentImageName.length === 0) {
    return;
  }
  const page = create.pages.find((page: Page) => page.name === create.currentImageName);
  if (page?.meta?.width === undefined) {
    return;
  }
  return page.meta.width * create.zoomRatio;
};
