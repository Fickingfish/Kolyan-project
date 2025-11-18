import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../entities/project.entity";
import { Repository } from "typeorm";
import { Board } from "../entities/board.entity";
import { Status } from "../entities/status.entity";
import { CreateProjectDto } from "../dto/create-project.dto";
import { User } from "src/users/entities/user.entity";
import { UpdateProjectDto } from "../dto/update-project.dto";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        @InjectRepository(Board)
        private boardsRepository: Repository<Board>,
        @InjectRepository(Status)
        private statusRepository: Repository<Status>,
    ) {}

    async create(createProjectDto: CreateProjectDto, owner: User): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      owner,
      members: [owner], 
    });

    const savedProject = await this.projectsRepository.save(project);

    const board = this.boardsRepository.create({
      project: savedProject,
    });

    const savedBoard = await this.boardsRepository.save(board);

    const defaultStatuses = [
      { name: 'To Do', order: 0 },
      { name: 'Doing', order: 1 },
      { name: 'Done', order: 2 },
    ];

    const statuses = defaultStatuses.map(statusData =>
      this.statusRepository.create({
        ...statusData,
        board: savedBoard,
      })
    );

    await this.statusRepository.save(statuses);

    return this.findOne(savedProject.id, owner.id);
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('project.board', 'board')
      .where('project.owner.id = :userId OR members.id = :userId', { userId })
      .orderBy('project.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('project.board', 'board')
      .leftJoinAndSelect('board.statuses', 'statuses')
      .where('project.id = :id', { id })
      .andWhere('(project.owner.id = :userId OR members.id = :userId)', { userId })
      .getOne();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findOne(id, userId);
    
    if (project.owner.id !== userId) {
      throw new ForbiddenException('Only project owner can update the project');
    }

    await this.projectsRepository.update(id, updateProjectDto);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    
    if (project.owner.id !== userId) {
      throw new ForbiddenException('Only project owner can delete the project');
    }

    await this.projectsRepository.remove(project);
  }
}