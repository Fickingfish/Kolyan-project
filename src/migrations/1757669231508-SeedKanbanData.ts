import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedKanbanData1757669231508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.insertSampleData(queryRunner);
    }

    private async insertSampleData(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query('SELECT id FROM users LIMIT 1');
    if (users.length === 0) {
      console.warn('No users found. Skipping seed data.');
      return;
    }

    const userId = users[0].id;

    const workspaceResult = await queryRunner.query(`
      INSERT INTO workspaces (name, description, owner_id)
      VALUES ('Development Team', 'Main workspace for development team', $1)
      RETURNING id
    `, [userId]);

    const workspaceId = workspaceResult[0].id;

    const boardResult = await queryRunner.query(`
      INSERT INTO boards (name, description, workspace_id, owner_id)
      VALUES ('Product Backlog', 'Product development tasks', $1, $2)
      RETURNING id
    `, [workspaceId, userId]);

    const boardId = boardResult[0].id;

    const columns = await queryRunner.query(`
      INSERT INTO columns (name, position, board_id)
      VALUES 
        ('To Do', 0, $1),
        ('In Progress', 1, $1),
        ('Done', 2, $1)
      RETURNING id
    `, [boardId]);

    const todoColumnId = columns[0].id;
    const inProgressColumnId = columns[1].id;
    const doneColumnId = columns[2].id;

    await queryRunner.query(`
      INSERT INTO cards (title, description, position, column_id, assignee_id, created_by, priority)
      VALUES 
        ('Implement user authentication', 'Add JWT authentication system', 0, $1, $2, $2, 'high'),
        ('Create database schema', 'Design and implement PostgreSQL schema', 1, $1, $2, $2, 'medium'),
        ('Setup CI/CD pipeline', 'Configure GitHub Actions for automated testing', 2, $1, $2, $2, 'medium')
    `, [todoColumnId, userId]);

    await queryRunner.query(`
      INSERT INTO labels (name, color, board_id)
      VALUES 
        ('Bug', '#dc3545', $1),
        ('Feature', '#28a745', $1),
        ('Urgent', '#ffc107', $1),
        ('Documentation', '#17a2b8', $1)
    `, [boardId]);

    await queryRunner.query(`
      INSERT INTO board_members (board_id, user_id, role)
      VALUES ($1, $2, 'owner')
    `, [boardId, userId]);

    console.log('Sample Kanban data seeded successfully');
  }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM board_members');
    await queryRunner.query('DELETE FROM labels');
    await queryRunner.query('DELETE FROM cards');
    await queryRunner.query('DELETE FROM columns');
    await queryRunner.query('DELETE FROM boards');
    await queryRunner.query('DELETE FROM workspaces');
    
    console.log('Sample Kanban data removed');
  }
}
