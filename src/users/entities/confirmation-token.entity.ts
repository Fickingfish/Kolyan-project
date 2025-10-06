import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

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

  // @ManyToOne('User', 'confirmationTokens', { onDelete: 'CASCADE' })
  // user: any;

  @Column()
  userId: string;

  isValid(): boolean {
    return new Date() < this.expiresAt;
  }
}

// import { User } from '../../users/entities/user.entity';