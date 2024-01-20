import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClientType, createClient } from 'redis';
import { Decision } from 'src/entities/decision';

@Injectable()
export class HistoryCacheService {

    private redisClient: Redis;

    constructor() {
        const Redis = require('ioredis');

        this.redisClient = new Redis({
            host: 'localhost',
            port: 6390,
        });
    }

   
    async setHistory(userEmail: string, history: Decision[]): Promise<void> {
        // const currentHistoryJson = await this.redisClient.get(userEmail);

        // const currentHistory: Decision[] = currentHistoryJson ? JSON.parse(currentHistoryJson) : [];

        // const updatedHistory = [...currentHistory, ...history];

        // console.log(userEmail)

        // console.log("updatedHistory", JSON.stringify(updatedHistory));

         this.redisClient.set(userEmail, JSON.stringify(history));
        return;
    }

    async getHistory(userEmail: string): Promise<Decision[] | null> {
        const historyJson = await this.redisClient.get(userEmail);
        if (historyJson) {
            console.log("historyJson", historyJson)
            return JSON.parse(historyJson);
        } else {
            return null;
        }
    }

    async deleteHistory(userEmail: string): Promise<void> {
        await this.redisClient.del(userEmail);
    }

    async updateHistory(userEmail: string, history: Decision[]): Promise<void> {
        const historyJson = JSON.stringify(history);
        await this.redisClient.set(userEmail, historyJson);
    }

}
