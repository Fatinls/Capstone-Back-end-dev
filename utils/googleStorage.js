const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  projectId: "analog-pilot-381004",
  keyFilename: "./credentials.json",
});
const bucket = storage.bucket("tukang-storage");

async function uploadToStorage(req, res, next) {
  if (req.file === undefined) {
    console.log("file not found")
    return next(new Error("File not found"));
    
  };
  
  const image = req.file;
  // const { originalname, buffer } = req.file;
  // const blob = bucket.file(image.originalname);
  const blob = bucket.file("image-"+  Date.now() + "-" + image.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    // Set the public URL for the image
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    req.publicUrl = publicUrl;
    console.log(req.publicUrl)
    next();
  });

  blobStream.end(image.buffer);
}

module.exports = uploadToStorage;