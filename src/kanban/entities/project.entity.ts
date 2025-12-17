import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "./board.entity";
import { Invitation } from "./invitation.entity";

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

  @ManyToMany(() => User, user => user.joinedProjects)
  @JoinTable({
    name: 'project_members_user',
    joinColumn: {
      name: 'projectId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId', 
      referencedColumnName: 'id',
    },
  })
  members: User[];

  @OneToOne(() => Board, board => board.project)
  board: Board;

  @OneToMany(() => Invitation, invitation => invitation.project)
  invitations: Invitation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}