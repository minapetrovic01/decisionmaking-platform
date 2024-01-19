import { Controller, Get, Post, Body, Put, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from 'src/entities/tag';
import { TagDto } from 'src/entities/tag.dto';
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAll(): Promise<Tag[]> {
    try{
      const allTags = this.tagService.getAll();
      return allTags;
    }
    catch(error)
    {
      console.error('Error getting all tags:', error);
      throw new InternalServerErrorException('Error getting all tags.');
    }
  }

  @Get(':name')
  async getByName(@Param('name') name: string): Promise<Tag> {
      try{
         const tag = this.tagService.getByName(name);
         return tag;
      } 
      catch(error)
      {
        console.error('Error getting tag:', error);
        throw new InternalServerErrorException('Error getting tag.');
      }
  }

  @Post()
  async create(@Body() tag: TagDto): Promise<Tag> {
    try{
      const createdTag= this.tagService.create(tag);
      return createdTag;
    }
    catch(error)
    {
      console.error('Error creating a tag:', error);
      throw new InternalServerErrorException('Error creating a tag.');
    }
  }

  @Put(':name')
  async update(@Param('name') name: string, @Body() tag: TagDto): Promise<Tag> {
    try{
      const updatedTag = this.tagService.update(name, tag);
      return updatedTag;
    }
    catch(error)
    {
      console.error('Error updating a tag:', error);
      throw new InternalServerErrorException('Error updating a tag.');
    }
  }

  @Delete(':name')
  async delete(@Param('name') name: string): Promise<Tag> {
    try{
      const deletedTag = this.tagService.delete(name);
      return deletedTag;
    }
    catch(error)
    {
      console.error('Error deleting a tag:', error);
      throw new InternalServerErrorException('Error deleting a tag.');
    }
  }
}
