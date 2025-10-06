import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKanbanSchema1757586851019 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
      CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');
    `);

    await queryRunner.query(`
      CREATE TYPE board_role AS ENUM ('owner', 'admin', 'member', 'viewer');
    `);

    await queryRunner.query(`
      CREATE TYPE activity_type AS ENUM (
        'card_created',
        'card_updated',
        'card_moved',
        'card_deleted',
        'comment_added',
        'comment_updated',
        'comment_deleted',
        'attachment_added',
        'attachment_deleted',
        'member_added',
        'member_removed',
        'label_added',
        'label_removed'
      );
    `);

        await queryRunner.query(`
      CREATE TABLE workspaces (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE boards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        owner_id UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE columns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        position INTEGER NOT NULL,
        board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE cards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        position INTEGER NOT NULL,
        column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
        assignee_id UUID REFERENCES users(id),
        created_by UUID NOT NULL REFERENCES users(id),
        due_date TIMESTAMP,
        priority VARCHAR(20) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE card_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE card_attachments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id),
        role VARCHAR(20) DEFAULT 'member', -- owner, admin, member, viewer
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(board_id, user_id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE board_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
        uploaded_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE labels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        color VARCHAR(7) DEFAULT '#007bff', -- hex color
        board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE card_labels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
        label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(card_id, label_id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE checklists  (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
        created_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE checklist_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content VARCHAR(500) NOT NULL,
        checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
        is_completed BOOLEAN DEFAULT FALSE,
        position INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(50) NOT NULL, -- card_created, card_moved, comment_added, etc.
        card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
        board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id),
        data JSONB, -- Additional data about the activity
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.createIndexes(queryRunner);
  }

  private async createIndexes(queryRunner: QueryRunner): Promise<void> {
    // Индексы для производительности
    await queryRunner.query(`
      CREATE INDEX idx_boards_workspace_id ON boards(workspace_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_columns_board_id ON columns(board_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_cards_column_id ON cards(column_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_cards_assignee_id ON cards(assignee_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_card_comments_card_id ON card_comments(card_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_board_members_board_id ON board_members(board_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_board_members_user_id ON board_members(user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_activities_board_id ON activities(board_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_activities_card_id ON activities(card_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
    `);

    // Составные индексы
    await queryRunner.query(`
      CREATE INDEX idx_columns_board_position ON columns(board_id, position);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_cards_column_position ON cards(column_id, position);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_checklist_items_checklist_position ON checklist_items(checklist_id, position);
    `);
  }

    public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Удаляем индексы сначала
    await this.dropIndexes(queryRunner);

    // 2. Удаляем таблицы в обратном порядке
    await queryRunner.query('DROP TABLE activities CASCADE');
    await queryRunner.query('DROP TABLE board_members CASCADE');
    await queryRunner.query('DROP TABLE cards CASCADE');
    // ... остальные таблицы

    // 3. Удаляем ENUM типы
    await queryRunner.query('DROP TYPE activity_type CASCADE');
    await queryRunner.query('DROP TYPE board_role CASCADE');
    await queryRunner.query('DROP TYPE priority_level CASCADE');
  }

  private async dropIndexes(queryRunner: QueryRunner): Promise<void> {
    const indexes = [
      'idx_boards_workspace_id',
      'idx_columns_board_id',
      'idx_cards_column_id',
      'idx_cards_assignee_id',
      'idx_card_comments_card_id',
      'idx_board_members_board_id',
      'idx_board_members_user_id',
      'idx_activities_board_id',
      'idx_activities_card_id',
      'idx_activities_created_at',
      'idx_columns_board_position',
      'idx_cards_column_position',
      'idx_checklist_items_checklist_position'
    ];

    for (const index of indexes) {
      try {
        await queryRunner.query(`DROP INDEX IF EXISTS ${index} CASCADE`);
      } catch (error) {
        console.warn(`Could not drop index ${index}:`, error.message);
      }
    }
  }
}
