import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTableIfNotExists("device_status", (table) => {
		table.increments("id").primary().notNullable();
		table.string("status_label").notNullable();
		table.string("status_description").notNullable();
	})

	await knex.schema.createTable("devices", (table) => {
		table.increments("id").primary().unique();
		table.string("name").notNullable();
		table.string("brand").notNullable();
		table.integer("device_status_id").unsigned().notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
	});

	await knex.schema.table('devices', (table) => {
		table.foreign("device_status_id")
			 .references("id")
			 .inTable("device_status");
	});
}


export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("device_status")
					  .dropTableIfExists("devices");
}

