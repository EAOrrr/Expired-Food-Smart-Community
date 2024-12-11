### 后端

#### 1. 跳转到`backend`文件夹
#### 2. 准备一个`PostgreSQL`数据库
此处给出`docker`运行`PostgreSQL`数据库的方案
1. 安装docker，参考 https://docs.docker.com/engine/install/
2. 在命令行中启动`PostgreSQL`的`docker`镜像
```bash
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
```
3. 在`.env`文件中配置`DATABASE_URL`
```
DATABASE_URL = postgres://postgres:mysecretpassword@localhost:5432/postgres
```
#### 3.. 根据以下步骤运行后端

```bash
# Install dependancies
$ npm install

# create a .env file and put there the MONGODB_URI for connecting to your postgreSQL database
$ echo "DATABASE_URL=<YOUR-DATABASE-URL>" > .env

# Set a variable SECRET which is a digital signature ensures that only parties who know the secret can generate a valid token.
$ echo "ACCESS_TOKEN_SECRET=youraccesstokensecretphrase" > .env
$ echo "REFRESH_TOKEN_SECRET=yourrefreshtokensecretphrase" > .env

# Start the application in dev environment
$ npm run dev

# Start the application in prod environment
$ npm start

# # Start the application in test environment and run tests
$ run start:test
$ npm test
```