import { createTracing } from "trace_events";
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateKanbanTables1759831053119 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'boards',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: "uuid",
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'ownerId',
                    type: 'uuid',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }));

        await queryRunner.createTable(new Table({
            name: 'boards_members_users',
            columns: [
                {
                    name: 'boardsId',
                    type: 'uuid',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                },
            ],
        }));

        await queryRunner.createTable(new Table({
            name: 'columns',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'position',
                    type: 'int',
                },
                {
                    name: 'boardId',
                    type: 'uuid',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }));

        await queryRunner.createTable(new Table({
            name: 'tasks',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'position',
                    type: 'int',
                },
                {
                    name: 'columnId',
                    type: 'uuid',
                },
                {
                    name: 'assigneeId',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'priority',
                    type: 'enum',
                    enum: ['low', 'medium', 'high', 'urgent'],
                    default: "'medium'",
                },
                {
                    name: 'dueDate',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }));

        await queryRunner.createTable(new Table({
            name: 'comments',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'content',
                    type: 'text',
                },
                {
                    name: 'authorId',
                    type: 'uuid',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                },

            ],
        }));

        await queryRunner.createTable(new Table ({
            name: 'attachments',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'filename',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'originalName',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'size',
                    type: 'int',
                },
                {
                    name: 'path',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'taskId',
                    type: 'uuid',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
            ],
        }));

        await queryRunner.createForeignKey('boards', new TableForeignKey({
            columnNames: ['ownerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('boards_members_users', new TableForeignKey({
            columnNames: ['boardsId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'boards',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('boards_members_users', new TableForeignKey({
            columnNames: ['usersId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('columns', new TableForeignKey({
            columnNames: ['boardId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'boards',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('tasks', new TableForeignKey({
            columnNames: ['columnsId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'columns',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('tasks', new TableForeignKey({
            columnNames: ['assigneeId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));

        await queryRunner.createForeignKey('comments', new TableForeignKey({
            columnNames: ['authorId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('comments', new TableForeignKey({
            columnNames: ['taskId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('attachments', new TableForeignKey({
            columnNames: ['taskId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createIndex('boards', new TableIndex({
            name: 'IDX_BOARD_OWNER',
            columnNames: ['ownerId'],
        }));

        await queryRunner.createIndex('columns', new TableIndex({
            name: 'IDX_COLUMN_BOARD',
            columnNames: ['boardId'],
        }));

        await queryRunner.createIndex('tasks', new TableIndex({
            name: 'IDX_TASK_COLUMN',
            columnNames: ['columnId'],
        }));

        await queryRunner.createIndex('tasks', new TableIndex({
            name: 'IDX_TASK_ASSIGNEE',
            columnNames: ['assigneeId'],
        }));

        await queryRunner.createIndex('comments', new TableIndex({
            name: 'IDX_ATTACHMENT_TASK',
            columnNames: ['taskId'],
        }));

        await queryRunner.createIndex('attachments', new TableIndex({
            name: 'IDX_ATTACHMENT_TASK',
            columnNames: ['taskId'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('attachments');
        await queryRunner.dropTable('comments');
        await queryRunner.dropTable('tasks');
        await queryRunner.dropTable('columns');
        await queryRunner.dropTable('boards_members_users');
        await queryRunner.dropTable('boards');
    }

}
