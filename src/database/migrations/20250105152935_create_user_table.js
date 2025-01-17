/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user', (table) => {
        table.increments('id_user').primary();
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.string('phone').notNullable();
        table.date('date_of_birth');
        table.enu('gender', ['male', 'female']);
        table.boolean('user_status').defaultTo(true);
        table.string('address');
        table.integer('role_id').unsigned().references('id_role').inTable('user_roles');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user');
};