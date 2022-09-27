import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { TwitterApi } from 'twitter-api-v2';

interface Post {
    userId: Number,
    id: Number,
    tittle: String,
    body: String
}

interface Client {
    appKey: String,
    appSecret: String,
    accessToken: String,
    accessSecret: String
}

interface TwittSearch {
    id:String,
    text:String
}

const client = new TwitterApi({
    appKey: 'LeYiKaHCGCcNzuflzEVX7UVCp',
    appSecret: 'PAcYRY665YHVBYr6JcPEpqbjbcFOxE8WyDEzFV5CwC1DkVGMX7',
    accessToken: '901500680015409152-i2zro9cMyw8YWthC3JHy0b8PgcDm6m9',
    accessSecret: 'L4rdwfjue9QogiGEvRb87X2RE2FrbeAGXjrwog6VucZdY'
})


const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
        let posts: [Post] = result.data;
        return res.status(200).json({
            message: posts
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const postTwitts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query = req.body.text;
        let result: AxiosResponse = await client.v2.get('tweets/search/recent', { query: query, max_results: 100 });
        let twits:[TwittSearch] = result.data;
        return res.status(200).json({
            message:twits
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

export default { getPosts, postTwitts }