import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "./entities/board.entity";
import { ColumnEntity } from "./entities/column.entity";
import { Task } from "./entities/task.entity";
import { Comment } from "./entities/comment.entity";
import { Attachment } from "./entities/attachment.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Board, ColumnEntity, Task, Comment, Attachment]),
    ],
    exports: [TypeOrmModule],
})
export class KanbanModule {}