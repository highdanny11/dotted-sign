import { 
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne
} from "typeorm"
import { Users } from "./Users"

@Entity()
export class Files {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  name: string

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

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  users: Users
}