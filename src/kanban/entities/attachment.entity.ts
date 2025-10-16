import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity('attachments')
export class Attachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @Column()
    originalName: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @Column()
    path: string;

    @ManyToOne(() => Task, task => task.attachment)
    task: Task;

    @Column()
    taskId: string;

    @CreateDateColumn()
    createdAt: string;
}