import { Request, Response, NextFunction, text } from "express";
import axios, { AxiosResponse } from "axios";
import IBM from "ibm-cos-sdk";
import { clientTwitter, configS3, discovery } from "../config/config";
import info from "../data.json";

interface TwittSearch {
    id: String,
    text: String
}

const connS3 = new IBM.S3(configS3);


const getResponse = async (req: Request, res: Response, next: NextFunction) => {
    let { type, message } = req.body;
    switch (type) {
        case "discovery":
            const resultDiscovery = await getDiscoveryMessage(message);
            return res.status(200).json({
                message: resultDiscovery
            })
            break;
        case "buscar":
            return res.status(200).json({
                data:{
                    message:info.Expedientes,
                },
            })
            break;
        case "expediente":
        const data = await  buscarCaso()   
        return res.status(200).json({
            data
        })
        break;
        case "twitter":
            const resTwits = await getTwits(message);
            return res.status(200).json({
                resTwits
            })
            break;
        default: ""
            break;
    }
}


async function buscarCaso(){
    const expediente = info.Expedientes[0]; 
    return expediente;
}


async function getDiscoveryMessage(params: string) {
    try {
        const params = {
            projectId: '26595ce8-835b-4d5e-a6c8-3f4b873fcf9d',
            query: 'text:senaida',
        };
        const response: any = await (await discovery.query(params)).result;
        return response.results[0].text
    } catch (e) {
        return e;
    }

}


async function  getTwits(params:string) {
    let query = params;
    console.log(query)
    let result: AxiosResponse = await clientTwitter.v2.get('tweets/search/recent', { query: query,max_results: 100 });
    let twits: [TwittSearch] = result.data;
    return twits;
}


const postTwitts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //const dataBucket = await getBucketContents("cloud-object-storage-uk-cos-archive-5f8");
        //const downloadFile = await getItem("cloud-object-storage-uk-cos-archive-5f8","CASO_090/Imágenes/Hechos/IMG_7708.jpg")
        let query = "zenaida serna";
        let result: AxiosResponse = await clientTwitter.v2.get('tweets/search/recent', { query: query, max_results: 100 });
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
    await bucleImage();
    return res.status(200).json({
        downloadFile
    })
}

async function bucleImage() {
    const images = ["CASO_090/Imágenes/Hechos/IMG_7708.jpg", "CASO_090/Imágenes/Hechos/IMG_7713.JPG", "CASO_090/Imágenes/Hechos/IMG_7953.JPG"];

    const results: string[] = await Promise.all(images.map(async (item): Promise<string> => {
        const data = await getItem("cloud-object-storage-uk-cos-archive-5f8", item);
        return item;
    }));
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

export default { postTwitts, getImage, getResponse }
