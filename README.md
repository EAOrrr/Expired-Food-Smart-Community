<a id="readme-top"></a>
## Built With

* [![React][React.js]][React-url]
* [![Vite][Vite.js]][Vite-url]
* [![Node.js][Node.js]][Node-url]
* [![Sequelize][Sequelize.js]][Sequelize-url]
* [![PostgreSQL][PostgreSQL]][PostgreSQL-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### 依赖项

* **Node.js**  
  下载并安装最新版本的 [Node.js](https://nodejs.org/)。

* **npm**  
  安装 Node.js 后，npm 会自动安装。你可以使用以下命令更新 npm 到最新版本：
  ```bash
  npm install npm@latest -g
  ```

### 前端

1. 跳转到 `frontend` 文件夹
2. 根据以下步骤运行前端
  ```bash
  # Install dependencies
  $ npm install

  # Start the application in dev environment
  $ npm run dev

  # Build the application for production
  $ npm run build

  # Preview the production build
  $ npm run preview

  # Lint the code
  $ npm run lint
  ```

### 后端

1. 跳转到 `backend` 文件夹
2. 准备一个 `PostgreSQL` 数据库  
   **TIPS:** `docker` 运行 `PostgreSQL` 映像是我们运行开发的方案，如使用其他方式运行 `PostgreSQL` 数据库，可能要修改 `backend/src/utils/db.js` 中 `sequelize` 的初始化。

   此处给出 `docker` 运行 `PostgreSQL` 映像数据库的方案：
   1. 安装 docker，参考 [Docker 安装文档](https://docs.docker.com/engine/install/)
   2. 在命令行中启动 `PostgreSQL` 的 `docker` 镜像
      ```bash
      docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
      ```
   3. 在 `.env` 文件中配置 `DATABASE_URL`
      ```env
      DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
      ```

3. 根据以下步骤运行后端
  ```bash
  # Install dependencies
  $ npm install

  # Create a .env file and put there the DATABASE_URL for connecting to your PostgreSQL database
  $ echo "DATABASE_URL=<YOUR-DATABASE-URL>" > .env

  # Set a variable ACCESS_TOKEN_SECRET which is a digital signature ensures that only parties who know the secret can generate a valid token.
  $ echo "ACCESS_TOKEN_SECRET=youraccesstokensecretphrase" >> .env

  # Initialize the database
  $ npm run init

  # Rollback the last migration
  $ npm run migration:down

  # Start the application in dev environment
  $ npm run dev

  # Start the application in test environment and run tests
  $ npm test
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Sequelize.js]: https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white
[Sequelize-url]: https://sequelize.org/
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/