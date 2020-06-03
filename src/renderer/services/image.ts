import { fs, jimp, path, path as nodePath, projectPathConfig } from '@/global';
import { v4 } from 'uuid';

export async function generateImageThumbnail({ sourcePath, projectPath }) {
  // generate image source file name
  const imageFilename = path.basename(sourcePath);
  const fileName = v4() + nodePath.extname(imageFilename);

  // generate thumbnail file name
  const thumbnailFileName = v4() + nodePath.extname(imageFilename);

  // target path
  const filePath = nodePath.join(projectPath, projectPathConfig.projectPagesDirectory, fileName);
  const thumbnailPath = nodePath.join(
    projectPath,
    projectPathConfig.projectThumbnailsDirectory,
    thumbnailFileName,
  );

  fs.copyFileSync(sourcePath, filePath);
  const image = await jimp.read(sourcePath);
  await image.resize(150, jimp.AUTO).writeAsync(thumbnailPath);
  return {
    imagePath: filePath,
    imageName: fileName,
    thumbnail: thumbnailPath,
    thumbnailName: thumbnailFileName,
  };
}

export async function cropImage({ filePath, outputDir, outputThumbnailDir = outputDir, x, y, height, width, cropWidth, cropHeight }) {
  console.log(filePath)
  const image = await jimp.read(filePath);
  console.log("image read")
  // get crop parameters
  const xScale = image.bitmap.width / cropWidth;
  const yScale = image.bitmap.height / cropHeight;
  image.crop(x * xScale, y * yScale, width * xScale, height * yScale);

  // write crop image
  const fileExt = nodePath.extname(filePath);
  const outputFilePath = path.join(outputDir, `${v4()}${fileExt}`);
  await image.writeAsync(outputFilePath);
  // update thumbnail
  await image.resize(150, jimp.AUTO);
  const outputThumbnailPath = path.join(outputThumbnailDir, `${v4()}${fileExt}`);
  await image.writeAsync(outputThumbnailPath);
  return { filePath: outputFilePath, thumbnailPath: outputThumbnailPath };
}

export const readImageInfo = async ({ imagePath }: { imagePath: string }) => {
  const image = await jimp.read(imagePath);
  const { width, height } = image.bitmap;
  return { width, height };
};
