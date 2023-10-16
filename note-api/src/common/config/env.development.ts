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
    accessKey: 'faV8ouYbz6OoogQ8x2Km',
    secretKey: 'tlXkv2Kb0xg8DtmmKagzo1d0X3ioZo8hPi6sBVV1',
    bucket: 'note',
  },
};
