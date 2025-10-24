const { DataSource } = require('typeorm');
const { ConfigService } = require('@nestjs/config');

const configService = new ConfigService();

module.exports = new DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST') || 'localhost',
    port: configService.get('DB_PORT') || 5432,
    username: configService.get('DB_USER') || 'root',
    password: configService.get('DB_PASSWORD') || 'root',
    database: configService.get('DB_NAME') || 'nestjs',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
});