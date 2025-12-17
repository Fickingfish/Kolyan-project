import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "src/users/entities/user.entity";

export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    EXPIRED = 'expired'
}

@Entity()
export class Invitation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.PENDING })
    status: InvitationStatus;

    @Column()
    token: string;

    @Column()
    expiresAt: Date;

    @ManyToOne(() => Project, project => project.invitations)
    project: Project;

    @ManyToOne(() => User, { nullable: true })
    invitedBy: User;

    @ManyToOne(() => User, {  nullable: true })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    isValid(): boolean {
        return this.status === InvitationStatus.PENDING && new Date() < this.expiresAt;
    }
}