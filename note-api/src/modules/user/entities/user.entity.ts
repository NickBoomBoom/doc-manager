import { IsEmail, Length } from 'class-validator';
import { Base } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

export enum Status {
  DISABLED = 0,
  ENABLED = 1,
}

@Entity({ name: 't_user' })
export abstract class User extends Base {
  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email: string;

  @Column({})
  name: string;

  @Column({ type: 'varchar', length: 16, select: false })
  @Length(5, 16) // 设置密码字段最小长度为 5，最大长度为 16
  password: string;

  @Column({ type: 'enum', enum: Status, default: Status.ENABLED })
  status: Status;

  @Column({
    nullable: true,
  })
  rootCategoryId: number | null;
}
