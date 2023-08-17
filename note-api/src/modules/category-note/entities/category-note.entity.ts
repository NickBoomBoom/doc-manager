import { User } from '../../user/entities/user.entity';
import { Base } from '../../../common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'm_category_note' })
export abstract class CategoryNote extends Base {
  @Column({
    default: null,
  })
  noteId: number;

  @Column({
    default: null,
  })
  categoryId: number;

  @Column({
    default: 0,
  })
  order: number;

  @Column({
    default: null,
  })
  userId: number;

  @Column({})
  belongCategoryId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({})
  isCategory: boolean;
}
