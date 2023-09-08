// content.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Content {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bytea' })
    file: Buffer;

    @Column()
    fileUrl: string

    @Column()
    fileName: string

    @Column({ default: 'ARCHIVED' })
    status: 'ARCHIVED' | 'RELEASED_DOCUMENT'

    @CreateDateColumn()
    createdAt: Date
}
