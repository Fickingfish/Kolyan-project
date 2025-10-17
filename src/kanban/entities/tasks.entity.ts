import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "./column.entity";
import { User } from "src/users/entities/user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => Status, status => status.tasks)
    status: Status;

    @ManyToOne(() => User, { nullable: true })
    assignee: User;

    @ManyToOne(() => User)
    creator: User;

    @Column('simple-array', { nullable: true })
    tags: string[];

    @Column({ nullable: true })
    order: number;

    @OneToMany(() => Comment, comment => comment.task)
    comments: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}