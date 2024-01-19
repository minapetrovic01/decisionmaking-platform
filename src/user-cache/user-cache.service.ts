import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClientType, createClient } from 'redis';
import { Decision } from 'src/entities/decision';

@Injectable()
export class UserCacheService {

    private client: RedisClientType;


    constructor() {

        this.client = createClient({
            url: 'redis://localhost:6390',
        });

        this.client.connect();

        this.client.on('error', err => console.log('Redis Client Error', err));

    }

    async setUserSupportsUp(userEmail: string): Promise<void> {

        await this.client.hIncrBy(userEmail, 'supports', 1);

    }

    async getUserSupports(userEmail: string): Promise<number | null> {
        ///this.client.connect();
        const userJson = await this.client.hGet(userEmail, 'supports');
        if (userJson) {
           // this.client.disconnect();
            console.log("iz redisa - userjson", userJson);
            return JSON.parse(userJson);
        } else {
            //this.client.disconnect();
            console.log("iz redisa - userjson", userJson);
            return 0;
        }
    }   

    async setUserSupportsDown(userEmail: string): Promise<void> {

        await this.client.hIncrBy(userEmail, 'supports', -1);

    }

    async getUnfinishedDecision(userEmail: string): Promise<Decision | null> {
        const userJson = await this.client.hGet(userEmail, 'unfinishedDecision');
        if (userJson) {
            return JSON.parse(userJson);
        } else {
            return null;
        }
    }

    async setUnfinishedDecision(userEmail: string, decision: Decision): Promise<void> {

        const decisionJson = JSON.stringify(decision);

        await this.client.hSet(userEmail, 'unfinishedDecision', decisionJson);

    }

    async deleteUnfinishedDecision(userEmail: string): Promise<void> {

        await this.client.hDel(userEmail, 'unfinishedDecision');

    }

    onModuleDestroy() {
        // Disconnect the client when the module is destroyed (e.g., when the application shuts down)
        if (this.client) {
            this.client.disconnect();
        }
    }

}
