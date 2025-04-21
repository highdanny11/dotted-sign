import { 
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm"

@Entity()
export class Signatory {
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
}