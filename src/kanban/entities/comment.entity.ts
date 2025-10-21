import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Task } from "./tasks.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @ManyToOne(() => Task, task => task.comments)
    task: Task;

    @ManyToOne(() => User)
    author: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date
}