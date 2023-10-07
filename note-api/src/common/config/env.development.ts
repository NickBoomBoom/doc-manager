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
    endPoint: 'localhost',
    port: 9001,
    accessKey: '104quVtuTiE7TiwZ0GwL',
    secretKey: 'XZO9W2Vy7lDHkwsrzEHgkZng6lugb6sJDSGu3VgX',
    bucket: 'note',
  },
};
