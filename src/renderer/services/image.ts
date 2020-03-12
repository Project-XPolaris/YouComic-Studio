import { applicationTempPath, fs, jimp, path, path as nodePath, projectPathConfig } from '@/global';
import { v4 } from 'uuid';

export async function generateImageThumbnail({ sourcePath, projectPath }) {
  // generate image source file name
  const imageFilename = path.basename(sourcePath)
  const fileName = v4() + nodePath.extname(imageFilename);

  // generate thumbnail file name
  const thumbnailFileName = v4() + nodePath.extname(imageFilename);

  // target path
  const filePath = nodePath.join(projectPath,projectPathConfig.projectPagesDirectory,fileName);
  const thumbnailPath = nodePath.join(projectPath,projectPathConfig.projectThumbnailsDirectory,thumbnailFileName);

  fs.copyFileSync(sourcePath, filePath);
  const image = await jimp.read(sourcePath);
  await image
    .resize(150, jimp.AUTO)
    .writeAsync(thumbnailPath);
  return { imagePath: filePath, imageName: fileName, thumbnail: thumbnailPath, thumbnailName: thumbnailFileName };
}

