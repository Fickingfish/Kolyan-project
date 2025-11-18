import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({ description: 'Project name' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({ description: 'Project description', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}