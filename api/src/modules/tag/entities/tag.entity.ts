import { Base } from '../../../common/entity/base.entity';
import { Doc } from '../../../modules/doc/entities/doc.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 't_tag' })
export abstract class Tag extends Base {
  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({})
  userId: number;
}
