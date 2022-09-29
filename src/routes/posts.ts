import express from "express";
import controller from "../controllers/posts";
const router = express.Router();

router.post('/getSearchTwits', controller.postTwitts);

router.get('/getImage',controller.getImage);
router.post('/response',controller.getResponse);

export = router;
