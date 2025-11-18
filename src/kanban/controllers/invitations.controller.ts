import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseGuards,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { InvitationsService } from '../services/invitations.service';
import { CreateInvitationDto } from '../dto/create-invitation.dto';
import { InvitationResponseDto } from '../dto/invitation-response.dto';
import { AcceptInvitationDto } from '../dto/accept-invitation.dto';

@ApiTags('invitations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('projects/:projectId/invite')
  @ApiOperation({ summary: 'Invite user to project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Invitation sent successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only project owner can invite' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User already member or has active invitation' })
  async create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() createInvitationDto: CreateInvitationDto,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    await this.invitationsService.createInvitation(projectId, createInvitationDto, user);
    return { message: 'Invitation sent successfully' };
  }

  @Post('accept')
  @ApiOperation({ summary: 'Accept project invitation' })
  @ApiQuery({ name: 'token', description: 'Invitation token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Invitation accepted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invitation not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invitation expired or invalid' })
  async accept(
    @Body() acceptInvitationDto: AcceptInvitationDto,
    @GetUser() user: User,
  ): Promise<{ message: string; projectId: string }> {
    const project = await this.invitationsService.acceptInvitation(acceptInvitationDto.token, user);
    return { 
      message: 'Invitation accepted successfully', 
      projectId: project.id 
    };
  }

  @Post('decline')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Decline project invitation' })
  @ApiQuery({ name: 'token', description: 'Invitation token' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Invitation declined' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invitation not found' })
  async decline(
    @Body() acceptInvitationDto: AcceptInvitationDto,
    @GetUser() user: User,
  ): Promise<void> {
    await this.invitationsService.declineInvitation(acceptInvitationDto.token, user);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get user invitations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns user invitations', type: [InvitationResponseDto] })
  async getMyInvitations(@GetUser() user: User): Promise<InvitationResponseDto[]> {
    const invitations = await this.invitationsService.getUserInvitations(user.email);
    return invitations.map(inv => this.mapToResponseDto(inv));
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get project invitations (owner only)' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns project invitations', type: [InvitationResponseDto] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only project owner can view invitations' })
  async getProjectInvitations(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @GetUser() user: User,
  ): Promise<InvitationResponseDto[]> {
    const invitations = await this.invitationsService.getProjectInvitations(projectId, user.id);
    return invitations.map(inv => this.mapToResponseDto(inv));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel invitation (owner only)' })
  @ApiParam({ name: 'id', description: 'Invitation ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Invitation cancelled' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invitation not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only project owner can cancel invitations' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    await this.invitationsService.cancelInvitation(id, user.id);
  }

  private mapToResponseDto(invitation: any): InvitationResponseDto {
    return {
      id: invitation.id,
      email: invitation.email,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      projectName: invitation.project?.name,
      invitedByName: invitation.invitedBy?.firstName + ' ' + invitation.invitedBy?.lastName,
      isValid: invitation.isValid(),
    };
  }
}