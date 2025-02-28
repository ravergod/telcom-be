import Knex from 'knex';

const database = 'test_telcom';

// Create the database
async function createTestDatabase() {
	const knex = Knex({
		client: 'mysql2',
		connection: {
			host: process.env.MYSQL_HOST,
			port: Number(process.env.MYSQL_PORT),
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD
		},
	});

	try {
		await knex.raw(`DROP DATABASE IF EXISTS ${database}`);
		await knex.raw(`CREATE DATABASE ${database}`);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	} finally {
		await knex.destroy();
	}
}

// Seed the database with schema and data
async function seedTestDatabase() {
	const knex = Knex({
		client: 'mysql2',
		connection: {
			host: process.env.MYSQL_HOST,
			port: Number(process.env.MYSQL_PORT),
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database
		},
	});

	try {
		await knex.migrate.latest();
		await knex.seed.run();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	} finally {
	await knex.destroy();
	}
}

module.exports = async () => {
	try {
		await createTestDatabase();
		await seedTestDatabase();
		console.log('Test database created successfully');
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}