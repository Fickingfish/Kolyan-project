import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('confirmation_tokens')
export class ConfirmationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.confirmationTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  isValid(): boolean {
    return new Date() < this.expiresAt;
  }
}