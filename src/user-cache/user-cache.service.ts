import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClientType, createClient } from 'redis';
import { Decision } from 'src/entities/decision';

@Injectable()
export class UserCacheService {

    private client: RedisClientType;


    constructor() {

        this.client = createClient({
            url: 'redis://localhost:6389',
        });

        this.client.connect();

        this.client.on('error', err => console.log('Redis Client Error', err));

    }

    async setUserSupportsUp(userEmail: string): Promise<void> {

        await this.client.hIncrBy(userEmail, 'supports', 1);

    }

    async getUserSupports(userEmail: string): Promise<number | null> {
        const userJson = await this.client.hGet(userEmail, 'supports');
        if (userJson) {
            return JSON.parse(userJson);
        } else {
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
        if (this.client) {
            this.client.disconnect();
        }
    }

}
