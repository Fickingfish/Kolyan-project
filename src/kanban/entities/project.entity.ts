import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "./board.entity";

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => User, user => user.createdProjects)
    owner: User;

    @ManyToMany(() => User, user => user.joinedProject)
    @JoinTable()
    members: User[];

    @OneToMany(() => Board, board => board.project)
    boards: Board[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}