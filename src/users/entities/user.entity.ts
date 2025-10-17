import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeUpdate, BeforeInsert, OneToMany, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from 'src/common/user-role.enum';
import * as bcrypt from 'bcrypt';
import { ConfirmationToken } from './confirmation-token.entity';
import { Project } from 'src/kanban/entities/project.entity';
import { Task } from 'src/kanban/entities/tasks.entity';
import { Comment } from 'src/kanban/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ConfirmationToken, token => token.user)
  confirmationTokens: ConfirmationToken[];

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ 
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER 
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @OneToMany(() => Project, project => project.owner)
  createdProjects: Project[];

  @ManyToMany(() => Project, project => project.members)
  joinedProject: Project[];

  @OneToMany(() => Task, task => task.assignee)
  assignedTask: Task[];

  @OneToMany(() => Task, task => task.creator)
  createdTask: Task[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      try {
        this.password = await bcrypt.hash(this.password, 12);
      } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Could not hash password');
      }
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}