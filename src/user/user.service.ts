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
        const session = this.neo4jService.getReadSession();
        const result = await session.run(
          `
          MATCH (u:User)
          RETURN u
          `
        );
    
        return result.records.map(record => record.get('u').properties);
      }
    
      async getById(email: string): Promise<User> {
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
    
        return result.records[0].get('u').properties;
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

      signIn(email: any, password: any): Promise<User> {
        console.log("usao u sign in");
        console.log(email);
        console.log(password);
        this.getById(email).then(user => {
          if(user.password === password) {
            return user;
          }
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
        return null;
      
    }
}
