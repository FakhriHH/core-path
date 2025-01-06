/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('password_reset', (table) => {
        table.increments('id_reset').primary();
        table.integer('id_user').unsigned().references('id_user').inTable('user').onDelete('CASCADE');
        table.string('reset_token').notNullable();
        table.boolean('is_used').defaultTo(false);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('password_reset');
};
