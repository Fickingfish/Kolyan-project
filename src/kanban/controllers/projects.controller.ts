import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ProjectsService } from "../services/projects.service";
import { ProjectResponseDto } from "../dto/project-response.dto";
import { CreateProjectDto } from "../dto/create-project.dto";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { User } from "src/users/entities/user.entity";
import { UpdateProjectDto } from "../dto/update-project.dto";

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Poject created succesfully', type:  ProjectResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation error' })
    async create(
        @Body() createProjectDto: CreateProjectDto,
        @GetUser() user: User,
    ): Promise<ProjectResponseDto> {
        const project = await this.projectsService.create(createProjectDto, user);
        return this.mapToResponseDto(project);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get project bu ID' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns project details', type: ProjectResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() user: User,
    ): Promise<ProjectResponseDto> {
        const project = await this.projectsService.findOne(id, user.id);
        return this.mapToResponseDto(project);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update project' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Project updated successfully', type: ProjectResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only project owner can update' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @GetUser() user: User,
    ): Promise<ProjectResponseDto> {
        const project = await this.projectsService.update(id, updateProjectDto, user.id);
        return this.mapToResponseDto(project);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete project' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Project deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only project owner can delete' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() user: User,
    ): Promise<void> {
        await this.projectsService.remove(id, user.id);
  }

  private mapToResponseDto(project: any): ProjectResponseDto {
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        ownerId: project.owner.id,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        memberCount: project.memberCount || project.members?.length || 0,
        taskCount: project.taskCount || 0,
    }
  }
}