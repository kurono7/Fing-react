import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";

interface Post {
    userId:Number,
    id: Number,
    tittle: String,
    body: String
}


const getPosts =async (req: Request, res: Response, next: NextFunction ) => {
    try{
        let result :AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
        let posts: [Post] = result.data;
        return res.status(200).json({
            message:posts
        })
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }


}

export default { getPosts }