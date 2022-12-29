import Jimp from 'jimp/browser/lib/jimp';

const File2Jimp = async (file: File): Promise<Jimp> => {
  return await new Promise((resolve, reject): void => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      if (event.target === null) {
        reject();
        return;
      }
      const data = event.target.result as ArrayBuffer;
      Jimp.read(data as Buffer)
      .then((image: Jimp): void => {
        resolve(image);
      })
      .catch((error: Error): void => {
        reject(error);
      });
    };
    reader.readAsArrayBuffer(file);
  });
};

export default File2Jimp;
