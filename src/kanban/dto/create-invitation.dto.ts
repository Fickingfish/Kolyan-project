import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateInvitationDto {
    @ApiProperty({ description: 'Email to invite' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}