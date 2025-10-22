import { name } from "ejs";
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateKanbanTables1761042601200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'project',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255'
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'ownerId',
                    type: 'uuid'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: 'project_members_user',
            columns: [
                {
                    name: 'projectId',
                    type: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'userId',
                    type: 'uuid',
                    isPrimary: true
                }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: 'board',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'projectId',
                    type: 'uuid',
                    isUnique: true
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: 'status',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100'
                },
                {
                    name: 'order',
                    type: 'int',
                    default: 0
                },
                {
                    name: 'boardId',
                    type: 'uuid'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: 'task',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255'
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'order',
                    type: 'int',
                    default: 0
                },
                {
                    name: 'statusId',
                    type: 'uuid'
                },
                {
                    name: 'assigneeId',
                    type: 'uuid',
                    isNullable: true
                },
                {
                    name: 'creatorId',
                    type: 'uuid'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: 'comment',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'content',
                    type: 'text'
                },
                {
                    name: 'taskId',
                    type: 'uuid'
                },
                {
                    name: 'authorId',
                    type: 'uuid'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()'
                }
            ]
        }));

        await queryRunner.createForeignKeys('project', [
            new TableForeignKey({
                columnNames: ['ownerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        ]);

        await queryRunner.createForeignKeys('project_members_user', [
            new TableForeignKey({
                columnNames: ['projectId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'project',
                onDelete: 'CASCADE'
            }),
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        ]);

        await queryRunner.createForeignKeys('board', [
            new TableForeignKey({
                columnNames: ['projectId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'project',
                onDelete:'CASCADE'
            })
        ]);

        await queryRunner.createForeignKeys('status', [
            new TableForeignKey({
                columnNames: ['boardId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'board',
                onDelete: 'CASCADE'
            })
        ]);

        await queryRunner.createForeignKeys('task', [
            new TableForeignKey({
                columnNames: ['statusId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'status',
                onDelete: 'CASCADE'
            }),
            new TableForeignKey({
                columnNames: ['assigneeId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL'
            }),
            new TableForeignKey({
                columnNames: ['creatorId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        ]);

        await queryRunner.createForeignKeys('comment', [
            new TableForeignKey({
                columnNames: ['taskId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'task',
                onDelete: 'CASCADE'
            }),
            new TableForeignKey({
                columnNames: ['authorId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comment');
        await queryRunner.dropTable('task');
        await queryRunner.dropTable('status');
        await queryRunner.dropTable('board');
        await queryRunner.dropTable('project_members_user');
        await queryRunner.dropTable('project');
    }

}
