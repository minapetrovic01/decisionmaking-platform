import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from 'src/entities/tag';
import { TagDto } from 'src/entities/tag.dto';
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAll(): Promise<Tag[]> {
    return this.tagService.getAll();
  }

  @Get(':name')
  async getByName(@Param('name') name: string): Promise<Tag> {
    return this.tagService.getByName(name);
  }

  @Post()
  async create(@Body() tag: TagDto): Promise<Tag> {
    return this.tagService.create(tag);
  }

  @Put(':name')
  async update(@Param('name') name: string, @Body() tag: TagDto): Promise<Tag> {
    return this.tagService.update(name, tag);
  }

  @Delete(':name')
  async delete(@Param('name') name: string): Promise<Tag> {
    return this.tagService.delete(name);
  }
}
