import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user';
import { UserDto } from 'src/entities/user.dto';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class UserService {
    
    constructor(private readonly neo4jService: Neo4jService) {}
   
      async create(userDto: UserDto): Promise<User> {
        //ako postoji user ne treba da se doda
        const session2 = this.neo4jService.getReadSession();
        const result2 = await session2.run(
          `
          MATCH (u:User {email: $email})
          RETURN u
          `,
          { email: userDto.email }
        );
        try{
          if (result2.records.length !== 0) {
            throw new NotFoundException(`User with email ${userDto.email} already exists`);
          }
        }
        catch(err){
          console.log(err);
          return this.getById(userDto.email);
        }
       
        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
          `
          CREATE (u:User $userDto)
          RETURN u
          `,
          { userDto }
        );
        return result.records[0].get('u').properties;
      }

      async getAll(): Promise<User[]> {
        try{
          const session = this.neo4jService.getReadSession();
          const result = await session.run(
            `
            MATCH (u:User)
            RETURN u
            `
          );
          return result.records.map(record => record.get('u').properties);
        }
        catch(error)
        {
          console.error('Error fetching users:', error);
          return null;
        }
      }
    
      async getById(email: string): Promise<User> {
        try{

          const session = this.neo4jService.getReadSession();
          const result = await session.run(
            `
            MATCH (u:User {email: $email})
            RETURN u
            `,
            { email }
          );
      
          if (result.records.length === 0) {
            throw new NotFoundException(`User with email ${email} not found`);
          } 
          console.log(result.records[0].get('u').properties);
          return result.records[0].get('u').properties;
        }
        catch(error)
        {
          console.error('Error fetching user:', error);
          throw error;
        }

      }
    
      async delete(email: string): Promise<User> {
        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
          `
          MATCH (u:User {email: $email})
          DETACH DELETE u
          RETURN u
          `,
          { email }
        );
    
        if (result.records.length === 0) {
          throw new NotFoundException(`User with email ${email} not found`);
        }
        return result.records[0].get('u').properties;
      
      }
    
      async update(email: string, userDto: UserDto): Promise<User> {
        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
          `
          MATCH (u:User {email: $email})
          SET u += $userDto
          RETURN u
          `,
          { email, userDto: { ...userDto, email } }
        );
    
        if (result.records.length === 0) {
          throw new NotFoundException(`User with email ${email} not found`);
        }
    
        return result.records[0].get('u').properties;
      }
      
      async signIn(email: any, password: any): Promise<User | null> {
      console.log("Entering signIn");
      console.log(email);
      console.log(password);
    
      try {
        const user = await this.getById(email);
    
        if (user && user.password === password) {
          console.log("Entering if statement");
          return user;
        } else {
          console.log("Password does not match");
          return null;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error; 
      }
      }
}
