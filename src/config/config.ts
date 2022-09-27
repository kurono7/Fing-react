import * as dotenv from "dotenv";

export abstract class configServer {
    constructor() {
        const nodeNameEnv = this.createPathEnv(this.nodeEnv);
        dotenv.config({
            path: nodeNameEnv
        });
    }

    public getEnviroment(key: string) {
        return process.env[key]
    }

    public getNumberEnv(key: string) {
        return Number(this.getEnviroment(key));
    }

    public get nodeEnv(): string {
        return this.getEnviroment('NODE_ENV')?.trim() || "";
    }

    public createPathEnv(path: string): string {
        const arrEnv: Array<string> = ['env']
        if (path.length > 0) {
            const stringToArray = path.split('.')
            arrEnv.unshift(...stringToArray)
        }
        return "." + arrEnv.join('.');
    }
}

