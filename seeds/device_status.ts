import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("device_status").del();

    // Inserts seed entries
    await knex("device_status").insert([
        { status_label: 'available', status_description: 'The device is available' },
        { status_label: 'in-use', status_description: 'The device is in-use' },
        { status_label: 'inactive', status_description: 'The device is inactive' }
    ]);
};