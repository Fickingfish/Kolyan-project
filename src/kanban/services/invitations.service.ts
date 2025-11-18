import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Invitation, InvitationStatus } from "../entities/invitation.entity";
import { Repository } from "typeorm";
import { Project } from "../entities/project.entity";
import { User } from "src/users/entities/user.entity";
import { EmailService } from "src/email/email.service";
import * as crypto from 'crypto';
import { CreateInvitationDto } from "../dto/create-invitation.dto";


@Injectable()
export class InvitationsService {
    constructor(
        @InjectRepository(Invitation)
        private invitationsRepository: Repository<Invitation>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        private emailService: EmailService,
    ) {}

    async createInvitation(projectId: string, createInvitationDto: CreateInvitationDto, inviter: User): Promise<Invitation> {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['owner', 'members', 'invitations'],
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (project.owner.id !== inviter.id) {
            throw new ForbiddenException('Only project owner can invite members');
        }

        if (createInvitationDto.email === inviter.email) {
            throw new BadRequestException('You cannot invite yourself');
        }

        const isAlreadeMember = project.members.some(member => member.email === createInvitationDto.email);
        if (isAlreadeMember) {
            throw new BadRequestException('User is already a project member');
        }

        const existingInvitation = project.invitations.find(
            inv => inv.email === createInvitationDto.email &&
            inv.status === InvitationStatus.PENDING &&
            new Date() < inv.expiresAt
        );
        if (existingInvitation) {
            throw new BadRequestException('Active invitation already exists for this email');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 2);

        const invitation = this.invitationsRepository.create({
            email: createInvitationDto.email,
            token,
            expiresAt,
            project,
            invitedBy: inviter,
        });

        const savedInvitation = await this.invitationsRepository.save(invitation);

        await this.sendInvitationEmail(savedInvitation);

        return savedInvitation;
    }

    async acceptInvitation(token: string, user: User): Promise<Project> {
        const invitation = await this.invitationsRepository.findOne({
            where:  { token },
            relations: ['project', 'project.members', 'project.owner'],
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.status === InvitationStatus.PENDING && new Date() > invitation.expiresAt) {
            invitation.status = InvitationStatus.EXPIRED;
            await this.invitationsRepository.save(invitation);
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new BadRequestException(`Invintaion is ${invitation.status.toLowerCase()}`)
        }

        if (invitation.email !== user.email) {
            throw new ForbiddenException('This invitation is for another user');
        }

        const isAlreadyMember = invitation.project.members.some(member => member.id === user.id);
        if (!isAlreadyMember) {
            invitation.project.members.push(user);
            await this.projectsRepository.save(invitation.project);
        }

        invitation.user = user;
        invitation.status = InvitationStatus.ACCEPTED;
        
        await this.invitationsRepository.save(invitation);

        return invitation.project;
    }

    async declineInvitation(token: string, user: User): Promise<void> {
        const invitation = await this.invitationsRepository.findOne({
            where: { token },
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.email !== user.email) {
            throw new ForbiddenException('This invitation is for another user');
        }

        invitation.status = InvitationStatus.DECLINED;
        await this.invitationsRepository.save(invitation);
    }

    async getUserInvitations(userEmail: string): Promise<Invitation[]> {
        await this.markExpiredInvitations();

        return this.invitationsRepository
        .createQueryBuilder('invitation')
        .leftJoinAndSelect('invitation.project', 'project')
        .leftJoinAndSelect('invitation.invitedBy', 'invitedBy')
        .where('invitation.email = :email', { email: userEmail })
        .andWhere('invitation.status = :status', { status: InvitationStatus.PENDING })
        .andWhere('invitation.expiresAt > :now', { now: new Date() })
        .orderBy('invitation.createdAt', 'DESC')
        .getMany();
    }

    private async markExpiredInvitations(): Promise<void> {
        const expiredInvitations = await this.invitationsRepository
            .createQueryBuilder('invitation')
            .where('invitation.expiresAt < :now', { now: new Date() })
            .andWhere('invitation.status = :status', { status: InvitationStatus.PENDING })
            .getMany();

        if (expiredInvitations.length > 0) {
            for (const invitation of expiredInvitations) {
                invitation.status = InvitationStatus.EXPIRED;
            }
            await this.invitationsRepository.save(expiredInvitations);
        }
    }

    async getProjectInvitations(projectId: string, useerId: string): Promise<Invitation[]> {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['owner'],
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (project.owner.id !== useerId) {
            throw new ForbiddenException('Only project owner can view invitations');
        }

        return this.invitationsRepository
        .createQueryBuilder('invitation')
        .leftJoinAndSelect('invitation.invitedBy', 'invitedBy')
        .leftJoinAndSelect('invitation.user', 'user')
        .where('invitation.project.id = :projectId', { projectId })
        .orderBy('invitation.createdAt', 'DESC')
        .getMany();
    }

    async cancelInvitation(invitationId: string, userId: string): Promise<void> {
        const invitation = await this.invitationsRepository.findOne({
            where: { id: invitationId },
            relations: ['project', 'project.owner'],
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.project.owner.id !== userId) {
            throw new ForbiddenException('Only project owner can cancel invitations');
        }

        await this.invitationsRepository.remove(invitation);
    }

    private async sendInvitationEmail(invitation: Invitation): Promise<void> {
        const acceptUrl = `http://localhost:3001/accept-invitations/accept?token=${invitation.token}`;
        const declineUrl = `http://localhost:3001/invitations/decline?token=${invitation.token}`;

        await this.emailService.sendInvitationEmail(
            invitation.email,
            invitation.project.name,
            invitation.invitedBy.firstName,
            acceptUrl,
            declineUrl,
            invitation.expiresAt
    );
  }
}