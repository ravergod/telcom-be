import Knex from 'knex'

const database = 'test_telcom'
const knex = Knex({
	client: 'mysql2',
	connection: {
		host: process.env.MYSQL_HOST,
		port: Number(process.env.MYSQL_PORT),
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD
	},
});

module.exports = async () => {
	try {
		await knex.raw(`DROP DATABASE IF EXISTS ${database}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}