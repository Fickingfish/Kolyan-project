import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "./board.entity";
import { Task } from "./task.entity";
import { Comment } from "./comment.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Board, board => board.owner)
    ownedBoards: Board[];

    @ManyToMany(() => Board, board => board.members)
    @JoinTable()
    boards: Board[];

    @OneToMany(() => Task, task => task.assignee)
    assignedTasks: Task[];

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[];
}