import { ApiProperty } from "@nestjs/swagger";

export class ProjectResponseDto {
    @ApiProperty({ description: 'Project ID' })
    id: string;

    @ApiProperty({ description: 'Project name' })
    name: string;

    @ApiProperty({ description: 'Project description', required: false })
    description?: string;

    @ApiProperty({ description: 'Owner ID' })
    ownerId: string;

    @ApiProperty({ description: 'Creation date' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date' })
    updatedAt: Date;

    @ApiProperty({ example: 3, description: 'Number of members' })
    memberCount?: number;

    @ApiProperty({ example: 5, description: 'Number of tasks' })
    taskCount?: number;
}