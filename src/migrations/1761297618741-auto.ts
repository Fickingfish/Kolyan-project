import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1761297618741 implements MigrationInterface {
    name = 'Auto1761297618741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_7384988f7eeb777e44802a0baca"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_94fe6b3a5aec5f85427df4f8cd7"`);
        await queryRunner.query(`ALTER TABLE "status" DROP CONSTRAINT "FK_b04aa8033132c9ff7b70b770a76"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_954fce22cf9a797afc6b1560c76"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`);
        await queryRunner.query(`CREATE TABLE "project_members_users" ("projectId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_b02651e55c7a0560b943d4d82a5" PRIMARY KEY ("projectId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c997499450ed2408c58fada0d" ON "project_members_users" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_17cf14cfac29c27dfaf3f66eb6" ON "project_members_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "task" ADD "tags" text`);
        await queryRunner.query(`ALTER TABLE "board" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "confirmation_tokens" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "confirmation_tokens" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "taskId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "authorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "order" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "order" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "creatorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "status" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "status" ALTER COLUMN "boardId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" ALTER COLUMN "projectId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "UQ_954fce22cf9a797afc6b1560c76"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "confirmation_tokens" ADD CONSTRAINT "FK_fd486aaf723277a630fbf1074b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_7384988f7eeb777e44802a0baca" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_94fe6b3a5aec5f85427df4f8cd7" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "status" ADD CONSTRAINT "FK_b04aa8033132c9ff7b70b770a76" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_954fce22cf9a797afc6b1560c76" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_members_users" ADD CONSTRAINT "FK_5c997499450ed2408c58fada0dd" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_members_users" ADD CONSTRAINT "FK_17cf14cfac29c27dfaf3f66eb65" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_members_users" DROP CONSTRAINT "FK_17cf14cfac29c27dfaf3f66eb65"`);
        await queryRunner.query(`ALTER TABLE "project_members_users" DROP CONSTRAINT "FK_5c997499450ed2408c58fada0dd"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_954fce22cf9a797afc6b1560c76"`);
        await queryRunner.query(`ALTER TABLE "status" DROP CONSTRAINT "FK_b04aa8033132c9ff7b70b770a76"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_94fe6b3a5aec5f85427df4f8cd7"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_7384988f7eeb777e44802a0baca"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`);
        await queryRunner.query(`ALTER TABLE "confirmation_tokens" DROP CONSTRAINT "FK_fd486aaf723277a630fbf1074b1"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "UQ_954fce22cf9a797afc6b1560c76" UNIQUE ("projectId")`);
        await queryRunner.query(`ALTER TABLE "board" ALTER COLUMN "projectId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "status" ALTER COLUMN "boardId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "status" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "creatorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "order" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "title" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "authorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "taskId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "confirmation_tokens" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "confirmation_tokens" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17cf14cfac29c27dfaf3f66eb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c997499450ed2408c58fada0d"`);
        await queryRunner.query(`DROP TABLE "project_members_users"`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_954fce22cf9a797afc6b1560c76" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "status" ADD CONSTRAINT "FK_b04aa8033132c9ff7b70b770a76" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_94fe6b3a5aec5f85427df4f8cd7" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_7384988f7eeb777e44802a0baca" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
