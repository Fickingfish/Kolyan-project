import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./entities/project.entity";
import { Board } from "./entities/board.entity";
import { Status } from "./entities/status.entity";
import { Task } from "./entities/task.entity";
import { ProjectsController } from "./controllers/projects.controller";
import { TasksController } from "./controllers/tasks.controller";
import { CommentsController } from "./controllers/comments.controller";
import { CommentsService } from "./services/comments.service";
import { TasksService } from "./services/tasks.service";
import { ProjectsService } from "./services/projects.service";
import { Comment } from "./entities/comment.entity";
import { InvitationsService } from "./services/invitations.service";
import { InvitationsController } from "./controllers/invitations.controller";
import { Invitation } from "./entities/invitation.entity";
import { EmailModule } from "src/email/email.module";
import { User } from "src/users/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Project, Board, Status, Task, Comment, Invitation, User]),
        EmailModule,
    ],
    controllers: [ProjectsController, TasksController, CommentsController, InvitationsController],
    providers: [ProjectsService, TasksService, CommentsService, InvitationsService],
    exports: [ProjectsService],
})
export class KanbanModule {}