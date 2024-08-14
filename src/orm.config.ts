import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: '',
  database: 'Test_api',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
