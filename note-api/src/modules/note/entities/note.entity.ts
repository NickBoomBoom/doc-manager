import { Base } from 'src/common/entity/base.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
@Entity({ name: 't_note' })
export abstract class Note extends Base {
  @Column()
  title: string;

  @Column('text')
  content: string;

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

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({})
  categoryId: number;

  @Column({
    type: 'varchar',
    default: '',
  })
  tags: string;
}
