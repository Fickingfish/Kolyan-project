import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./entities/project.entity";
import { Board } from "./entities/board.entity";
import { Status } from "./entities/status.entity";
import { Task } from "./entities/tasks.entity";
import { ProjectsController } from "./controllers/projects.controller";
import { TasksController } from "./controllers/tasks.controller";
import { CommentsController } from "./controllers/comments.controller";
import { CommentsService } from "./services/comments.service";
import { TasksService } from "./services/tasks.service";
import { ProjectsService } from "./services/projects.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Project, Board, Status, Task, Comment]),
    ],
    controllers: [ProjectsController, TasksController, CommentsController],
    providers: [ProjectsService, TasksService, CommentsService],
    exports: [ProjectsService],
})
export class KanbanModule {}