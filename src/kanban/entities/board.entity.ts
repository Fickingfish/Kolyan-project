import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "./project.entity";
import { Status } from "./status.entity";

@Entity()
export class Board {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Project, project => project.board)
    @JoinColumn()
    project: Project;

    @OneToMany(() => Status, status => status.board, { cascade: true })
    statuses: Status[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}