import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AcceptInvitationDto {
    @ApiProperty({ description: 'Invitation token' })
    @IsNotEmpty()
    token: string;
}