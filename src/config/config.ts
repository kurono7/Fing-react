import { TwitterApi } from 'twitter-api-v2';
import DiscoveryV2 from "ibm-watson/discovery/v2";
import { IamAuthenticator } from "ibm-watson/auth";
import dotenv from "dotenv";
//import DiscoveryV1 from 'ibm-watson/discovery/v1';

dotenv.config()

//
const appKey = String(process.env.APPKEYTWITTER);
const appSecret = String(process.env.APPSECRET);
const accessToken = String(process.env.ACCESSTOKEN);
const accessSecret = String(process.env.ACCESSSECRET);


//
const endpoint = String(process.env.ENDPOINT);
const apiKeyId = String(process.env.APIKEYID);
const serviceInstanceId = String(process.env.SERVICE_INSTANCE);
const signatureVersion = String(process.env.SIGNATURE);

//

const serviceUrl = String(process.env.SERVICE_URL);
const keyDiscovery = String(process.env.KEY_DISCOVERY);



export const clientTwitter = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret
});


export const configS3 = {
    endpoint: endpoint,
    apiKeyId: apiKeyId,
    serviceInstanceId: serviceInstanceId,
    signatureVersion: signatureVersion,
};


export const discovery = new DiscoveryV2({
    version: '2019-02-01',
    authenticator: new IamAuthenticator({
        apikey: keyDiscovery,
    }),
    serviceUrl: serviceUrl,
    disableSslVerification: true,
});