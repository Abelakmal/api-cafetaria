"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeOrmConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    username: configService.get('database.user'),
    password: configService.get('database.password'),
    database: configService.get('database.name'),
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
});
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=ormconfig.js.map