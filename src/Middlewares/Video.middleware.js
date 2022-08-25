import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const videoStorage = multer.diskStorage({
  destination: "videos",
  filename: (request, file, cb) => {
    const id = uuidv4();
    const token = request.token;
    const filename = `${token._id.toString()}-${id}`;
    request.filename = filename;
    cb(null, filename);
  },
});

export const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 90000000 * 5,
  },
  fileFilter: (request, file, cb) => {
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error("Video format not supported"));
    }
    cb(undefined, true);
  },
});
