import pLimit from "p-limit";
import cloudinary from "./cloudinary.js";

const limit = pLimit(5); // Simultaneously uploads 5 images at once

async function uploadImagesFunctionSingle(image) {
  // First cnvert the buffer to base64, then to dataURI
  const b64 = Buffer.from(image.buffer, "utf-8").toString("base64");
  const bufferImagesToB64 = `data:${image.mimetype};base64,${b64}`;

  // console.log(bufferImagesToB64);

  const imagesToUpload = limit(async () => {
    const result = await cloudinary.uploader.upload(bufferImagesToB64, {
      resource_type: "auto",
    });
    return result.secure_url;
  });

  return await imagesToUpload;
}

async function uploadImagesFunctionMultiple(images) {
  // First cnvert the buffer to base64, then to dataURI
  const bufferImagesToB64 = images.map((image) => {
    const b64 = Buffer.from(image.buffer, "utf-8").toString("base64");

    return `data:${image.mimetype};base64,${b64}`;
  });

  // console.log(bufferImagesToB64);

  const imagesToUpload = bufferImagesToB64.map((base64Imgs) => {
    return limit(async () => {
      const results = await cloudinary.uploader.upload(base64Imgs, {
        resource_type: "auto",
      });
      return results.secure_url;
    });
  });

  const imgResults = await Promise.all(imagesToUpload);

  return imgResults;
}

export { uploadImagesFunctionSingle, uploadImagesFunctionMultiple };
