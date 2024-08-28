// import fastifyJwt from "fastify-jwt";
// import {userRoutes} from "./modules/user/user.route";
// import {userSchemas} from "./modules/user/user.schema";
// import {productSchemas} from "./modules/product/product.schema";
// import {productRoutes} from "./modules/product/product.route";
// import { version } from "../package.json"
// import swagger from "@fastify/swagger-ui"
// import {withRefResolver} from "fastify-zod";

import Fastify from "fastify";
import { boardSchemas } from "./modules/boards/boards.schema";
import { listSchemas } from "./modules/lists/lists.schema";
import { boardRoutes } from "./modules/boards/boards.route";

import cors from "@fastify/cors";
import { listRoutes } from "./modules/lists/lists.route";

export const server = Fastify({ logger: true });

server.register(import("@fastify/swagger"), {
  swagger: {
    info: {
      title: "API Documentation",
      description: "API для управления досками и списками",
      version: "1.0.0",
    },
    host: "localhost:4000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});
server.register(import("@fastify/swagger-ui"), {
  routePrefix: "/docs",
});

server.register(boardRoutes, {
  prefix: "api/boards",
});

server.register(listRoutes, {
  prefix: "api/lists",
});

async function main() {
  for (const schema of [...boardSchemas, ...listSchemas]) {
    server.addSchema(schema);
  }

  await server.register(cors, {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });

  server.listen(
    {
      port: 4000,
      host: "0.0.0.0",
    },
    (err, address) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`Server listening at ${address}`);
    },
  );
}

main();
