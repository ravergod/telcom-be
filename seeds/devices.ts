import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("devices").del();

    // Inserts seed entries
    await knex("devices").insert([
        { name: "Iphone 13 Pro Max", brand: "Apple", device_status_id: "1" },
        { name: "Galaxy S25 Ultra", brand: "Samsung", device_status_id: "2" },
        { name: "Redmi Note 10", brand: "Xiaomi", device_status_id: "3" },
    ]);
};
