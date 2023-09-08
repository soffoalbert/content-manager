import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  emailAddress: string;

  @Column()
  userType: string;

  @CreateDateColumn()
  createdAt: Date
}
