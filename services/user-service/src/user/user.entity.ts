import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum Role {
  ADMINISTRATOR = 'ADMINISTRATOR',
  CONTENT_CREATOR = 'CONTENT_CREATOR',
  CONTENT_REVIEWER = 'CONTENT_REVIEWER'
}

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

  @Column({unique: true})
  emailAddress: string;

  @Column({ type: 'enum', enum: Role })
  userType: Role;

  @CreateDateColumn()
  createdAt: Date
}
