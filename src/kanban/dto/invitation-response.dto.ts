import { ApiProperty } from "@nestjs/swagger";
import { InvitationStatus } from "src/kanban/entities/invitation.entity";

export class InvitationResponseDto {
    @ApiProperty({ description: 'Invitation ID' })
    id: string;

    @ApiProperty({ description: 'Invited email' })
    email: string;

    @ApiProperty({ enum: InvitationStatus, description: 'Invitation status' })
    status: InvitationStatus;

    @ApiProperty({ description: 'Expiration date' })
    expiresAt: Date;

    @ApiProperty({ description: 'Project name' })
    projectName: string;

    @ApiProperty({ description: 'Who sent this invitation' })
    invitedByName: string;

    @ApiProperty({ description: 'Is invitation valid' })
    isValid: boolean;
}