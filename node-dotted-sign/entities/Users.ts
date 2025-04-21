import { 
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany
} from "typeorm"
import { Files } from './Files'


@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  name: string

  @Column({
    type: 'varchar',
    length: 320,
    nullable: false,
    unique: true
  })
  email: string

  @Column({
    type: 'varchar',
    length: 72,
    nullable: false,
    select: false
  })
  password: string

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

  @OneToMany(() => Files, files => files.users, {
    cascade: true
  })
  files: Files[]
}