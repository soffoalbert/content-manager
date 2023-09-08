// src/reviews/review.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

export enum ReviewStatus {
    Approved = 'approved',
    Rejected = 'rejected',
    Pending = 'pending'
}

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    documentId: number;

    @Column()
    userId: number;

    @Column()
    approval: ReviewStatus

    @CreateDateColumn()
    createdAt?: Date
}
