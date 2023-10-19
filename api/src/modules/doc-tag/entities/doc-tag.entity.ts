import { Base } from '../../../common/entity/base.entity';
import { Doc } from '../../../modules/doc/entities/doc.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'm_doc_tag' })
export abstract class DocTag extends Base {
  @Column({})
  tagIds: string;

  @OneToOne(() => Doc, (doc) => doc.id)
  doc: Doc;

  @Column()
  docId: number;

  @Column()
  userId: number;
}
