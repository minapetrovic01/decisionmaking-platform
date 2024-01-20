import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClientType, createClient } from 'redis';
import { Decision } from 'src/entities/decision';

@Injectable()
export class HistoryCacheService {

    // private redisClient: Redis;
    private client: RedisClientType;


    constructor() {
        const Redis = require('ioredis');

        this.client = createClient({
            url: 'redis://localhost:6390',
        });

        this.client.connect();

        this.client.on('error', err => console.log('Redis Client Error', err));

        // this.redisClient = new Redis({
        //     host: 'localhost',
        //     port: 6390,
        // });
    }

   
    async setHistory(userEmail: string, history: Decision[]): Promise<void> {
        const currentHistoryJson = await this.client.hGet(userEmail,"history");

        const currentHistory: Decision[] = currentHistoryJson ? JSON.parse(currentHistoryJson) : [];

        const updatedHistory = [...currentHistory, ...history];

        await this.client.hSet(userEmail, "history", JSON.stringify(updatedHistory));
 
        return;
    }

    async getHistory(userEmail: string): Promise<Decision[] | null> {
        const historyJson = await this.client.hGet(userEmail,"history");
        if (historyJson) {
            return JSON.parse(historyJson);
        } else {
            return [];
        }
    }

    async deleteHistory(userEmail: string): Promise<void> {
        await this.client.hDel(userEmail,"history");
    }

    async updateHistory(userEmail: string, history: Decision[]): Promise<void> {
        const historyJson = JSON.stringify(history);
        await this.client.hSet(userEmail,"history", historyJson);
    }
    onModuleDestroy() {
        if (this.client) {
            this.client.disconnect();
        }
    }
}
