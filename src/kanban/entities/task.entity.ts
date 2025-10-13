import { Attachment } from './attachment.entity';
import { ColumnEntity } from './column.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';
import { Column, CreateDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    position: number;

    @ManyToOne(() => ColumnEntity, column => column.tasks)
    column: ColumnEntity;

    @Column()
    columnId: string;

    @ManyToOne(() => User, user => user.assignedTasks, { nullable: true })
    assignee: User;

    @Column({ nullable: true })
    assignedId: true;

    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;

    @Column({ type: 'date', nullable: true })
    dueDate: Date;

    @OneToMany(() => Comment, comment => comment.task, { cascade: true })
    comments: Comment[];

    @OneToMany(() => Attachment, attachment => attachment.task, { cascade: true })
    attachment: Attachment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}