import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { TwitterApi } from 'twitter-api-v2';
import IBM from "ibm-cos-sdk";

interface Post {
    userId: Number,
    id: Number,
    tittle: String,
    body: String
}
interface TwittSearch {
    id: String,
    text: String
}

const client = new TwitterApi({
    appKey: 'LeYiKaHCGCcNzuflzEVX7UVCp',
    appSecret: 'PAcYRY665YHVBYr6JcPEpqbjbcFOxE8WyDEzFV5CwC1DkVGMX7',
    accessToken: '901500680015409152-i2zro9cMyw8YWthC3JHy0b8PgcDm6m9',
    accessSecret: 'L4rdwfjue9QogiGEvRb87X2RE2FrbeAGXjrwog6VucZdY'
})

const config = {
    endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
    apiKeyId: 'lK0cAlHjB1UiHa3mVqA-njqNJylGPMl-g1JsGH7_ifop',
    serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/5d969b6a581645c1be2f6edf3d3bfe63:28648e68-c444-4de6-b0cf-1bbe41cb0bc1::',
    signatureVersion: 'iam',
};


const connS3 = new IBM.S3(config);

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
        let posts: [Post] = result.data;
        return res.status(200).json({
            data: {
                messages: posts
            },
            component: "redes"
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const postTwitts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //const dataBucket = await getBucketContents("cloud-object-storage-uk-cos-archive-5f8");
        //const downloadFile = await getItem("cloud-object-storage-uk-cos-archive-5f8","CASO_090/Imágenes/Hechos/IMG_7708.jpg")
        let query = "zenaida serna";
        let result: AxiosResponse = await client.v2.get('tweets/search/recent', { query: query, max_results: 100 });
        let twits: [TwittSearch] = result.data;
        return res.status(200).json({
            data: {
                messages: twits
            },
            component: "redes"
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getImage = async (req: Request, res: Response, next: NextFunction) => {
    const downloadFile = await getItem("cloud-object-storage-uk-cos-archive-5f8", "CASO_090/Imágenes/Hechos/IMG_7708.jpg");
    return res.status(200).json({
        downloadFile
    })
}

async function getBucketContents(bucketName: string) {
    console.log(`Retrieving bucket contents from: ${bucketName}`);
    return connS3.listObjects(
        { Bucket: bucketName },
    ).promise()
        .then((data) => {
            if (data != null && data.Contents != null) {
                for (var i = 0; i < data.Contents.length; i++) {
                    var itemKey = data.Contents[i].Key;
                    var itemSize = data.Contents[i].Size;
                    console.log(`Item: ${itemKey} (${itemSize} bytes).`)
                }
            }
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

async function getItem(bucketName: string, itemName: any) {
    console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
    return connS3.getObject({
        Bucket: bucketName,
        Key: itemName
    }).promise()
        .then((data: any) => {
            if (data != null) {
                const ima = Buffer.from(data.Body, 'binary').toString('base64');
                return `data:image/jpeg;base64,${ima}`
            }
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

export default { getPosts, postTwitts, getImage }
