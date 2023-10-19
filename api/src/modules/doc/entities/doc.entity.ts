import { Base } from '../../../common/entity/base.entity';
import { DocTag } from '../../../modules/doc-tag/entities/doc-tag.entity';
import { Space } from '../../../modules/space/entities/space.entity';
import { Tag } from '../../../modules/tag/entities/tag.entity';
import { User } from '../../../modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity({ name: 't_doc' })
export abstract class Doc extends Base {
  @Column()
  title: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  content: object;

  @Column({
    default: false,
  })
  isLocked: boolean;

  @Column({
    unique: true,
  })
  shareCode: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({})
  userId: number;

  @ManyToOne(() => Space)
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @Column({})
  spaceId: number;

  @OneToOne(() => DocTag, (docTag) => docTag.tagIds)
  docTag: DocTag;

  @Column({
    nullable: true,
  })
  docTagId: number | null;
}
