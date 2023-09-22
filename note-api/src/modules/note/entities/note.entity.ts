import { Base } from 'src/common/entity/base.entity';
import { Space } from 'src/modules/space/entities/space.entity';
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

  @ManyToOne(() => Space)
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @Column({})
  spaceId: number;

  @Column({
    type: 'varchar',
    default: '',
  })
  tags: string;
}
