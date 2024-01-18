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

        this.client.disconnect();
    }

    async setUserSupportsUp(userEmail: string): Promise<void> {
        this.client.connect();

        await this.client.hIncrBy(userEmail, 'supports', 1);

        this.client.disconnect();
    }

    async getUserSupports(userEmail: string): Promise<number | null> {
        this.client.connect();
        const userJson = await this.client.hGet(userEmail, 'supports');
        if (userJson) {
            this.client.disconnect();
            return JSON.parse(userJson);
        } else {
            this.client.disconnect();
            return null;
        }
    }   

    async setUserSupportsDown(userEmail: string): Promise<void> {
        this.client.connect();

        await this.client.hIncrBy(userEmail, 'supports', -1);

        this.client.disconnect();
    }

    async getUnfinishedDecision(userEmail: string): Promise<Decision | null> {
        this.client.connect();
        const userJson = await this.client.hGet(userEmail, 'unfinishedDecision');
        if (userJson) {
            this.client.disconnect();
            return JSON.parse(userJson);
        } else {
            this.client.disconnect();
            return null;
        }
    }

    async setUnfinishedDecision(userEmail: string, decision: Decision): Promise<void> {
        this.client.connect();

        const decisionJson = JSON.stringify(decision);

        await this.client.hSet(userEmail, 'unfinishedDecision', decisionJson);

        this.client.disconnect();
    }

    async deleteUnfinishedDecision(userEmail: string): Promise<void> {
        this.client.connect();

        await this.client.hDel(userEmail, 'unfinishedDecision');

        this.client.disconnect();
    }

    

}
