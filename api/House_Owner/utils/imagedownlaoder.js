import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';



export function downloadPhoto(link, folder, fileName) {
  return new Promise((resolve, reject) => {
    const protocol = link.startsWith('https') ? https : http;
    const filePath = path.join(folder, fileName);

    const request = protocol.get(link, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${link}' (${response.statusCode})`));
      }

      const fileStream = fs.createWriteStream(filePath);
      fileStream.on('error', (error) => {
        fs.unlink(filePath, () => reject(error));
      });

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filePath);
      });
    });

    request.on('error', (error) => {
      fs.unlink(filePath, () => reject(error));
    });
  });
}
