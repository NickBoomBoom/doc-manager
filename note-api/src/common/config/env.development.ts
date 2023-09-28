export default {
  // 服务基本配置
  SERVICE_CONFIG: {
    // 端口
    port: 4399,
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
      expiresIn: '7d',
    },
  },

  MINIO_CONFIG: {
    endPoint: '172.17.0.2',
    port: 9000,
    accessKey: '1PXGcdUzNo8UxCg3LlSq',
    secretKey: 'CsZ8ZAqbP1aPJKZId603P9yUTj1k3DWtj3FVsDaL',
    bucket: 'note',
  },
};
