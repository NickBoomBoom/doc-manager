import { Base } from 'src/common/entity/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
@Entity({ name: 't_menu' })
export abstract class Menu extends Base {
  @Column('json')
  raw: object;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
