import { Router } from "express";
import { Authenticate } from "../Middlewares/Authenticate.middleware";
import { videoUpload } from "../Middlewares/Video.middleware";

const router = Router();

router.post(
  "/api/video",
  Authenticate,
  videoUpload.single("video"),
  (request, response) => {
    console.log("Filename", request.filename);
    return response.status(200).json({ msg: "Authenticanted" });
  }
);

export default router;
