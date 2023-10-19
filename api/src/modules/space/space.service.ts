import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpaceDTO } from './dto/create-space.dto';
import { Space } from './entities/space.entity';
import { UpdateSpaceDTO } from './dto/update-space.dto';
import { MenuService } from '../menu/menu.service';
import { MenuItem } from '../menu/menu.interface';
@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    public readonly spaceRepository: Repository<Space>,
    private readonly menuService: MenuService,
  ) {}

  async create(userId: number, createSpaceDto: CreateSpaceDTO): Promise<any> {
    const obj = {
      ...createSpaceDto,
      userId,
    };
    const { parentId } = createSpaceDto;
    const space = await this.spaceRepository.create(obj);
    const res = await this.spaceRepository.save(space);
    if (parentId) {
      const menuRow = await this.menuService.createBySpace(
        userId,
        res.id,
        parentId,
      );
      return {
        isSpace: true,
        isNote: false,
        menuId: menuRow.id,
        targetId: res.id,
        children: [],
        data: {
          name: res.name,
          parentId: res.parentId,
        },
      } as MenuItem;
    }
    return res;
  }

  async findOne(userId: number, id: number): Promise<Space> {
    const res = await this.spaceRepository.findOne({
      where: {
        id,
        userId,
      },
    });
    if (res) {
      return res;
    } else {
      throw new Error('空间不存在或非当前空间');
    }
  }

  async update(
    spaceId: number,
    userId: number,
    updateSpaceDto: UpdateSpaceDTO,
  ) {
    const target = await this.findOne(userId, spaceId);
    await this.spaceRepository.update(spaceId, {
      ...target,
      ...updateSpaceDto,
    });
    return true;
  }

  async delete(userId: number, spaceId: number): Promise<boolean> {
    await this.menuService.deleteBySpace(userId, spaceId);
    await this.spaceRepository.delete(spaceId);
    return true;
  }
}
