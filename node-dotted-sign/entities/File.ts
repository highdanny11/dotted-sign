import { 
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm"

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  name: string

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  data: string

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  status: string

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false
  })
  created_at: string

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false
  })
  updated_at: string
}