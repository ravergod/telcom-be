import { Knex } from "knex";
import 'dotenv/config';

const config: Knex.Config = {
	client: "mysql2",
	connection: {
		host: process.env.MYSQL_HOST,
		port: Number(process.env.MYSQL_PORT),
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
	},
	migrations: {
		directory: "./migrations",
	},
	seeds: {
		directory: "./seeds",
	}
};

export default config;