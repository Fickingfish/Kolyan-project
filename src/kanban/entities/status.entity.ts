import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "./board.entity";
import { Task } from "./tasks.entity";

@Entity()
export class Status {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 0 })
    order: number

    @ManyToOne(() => Board, board => board.statuses)
    board: Board;

    @OneToMany(() => Task, task => task.status, { cascade: true })
    tasks: Task[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}