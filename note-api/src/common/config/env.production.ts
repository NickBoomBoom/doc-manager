export default {
  // 服务基本配置
  SERVICE_CONFIG: {
    // 端口
    port: 3000,
  },

  // 数据库配置
  DATABASE_CONFIG: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'chenqi123',
    database: 'note',
    autoLoadEntities: true,
    synchronize: true,
  },

  JWT_CONFIG: {
    secret: 'secret_token_key',
    signOptions: {
      expiresIn: '30d',
    },
  },
};
