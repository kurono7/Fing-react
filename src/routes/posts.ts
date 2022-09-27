import express from "express";
import controller from "../controllers/posts";
const router = express.Router();

router.get('/posts', controller.getPosts);

router.post('/getSearchTwits', controller.postTwitts);

router.get('/getImage',controller.getImage);

export = router;
