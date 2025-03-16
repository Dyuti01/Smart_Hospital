const cloudinary = require("cloudinary");

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

export const uploadImage = (image:any) => {
  //imgage = > base64
  console.log("hello1")
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error:any, result:any) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      console.log("Hello")
      return reject({ message: error.message });
    });
  });
};

module.exports = (image:any) => {
  //imgage = > base64
  console.log("hello2")

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error:any, result:any) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};


// export const uploadMultipleImages = (images) => {
//   return new Promise((resolve, reject) => {
//     const uploads = images.map((base) => uploadImage(base));
//     Promise.all(uploads)
//       .then((values) => resolve(values))
//       .catch((err) => reject(err));
//   });
// };