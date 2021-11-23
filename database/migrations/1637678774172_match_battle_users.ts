import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchBattleUsers extends BaseSchema {
  protected tableName = 'match_battle_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('match_battle_id')
        .unsigned()
        .references('match_battles.id')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table
        .boolean('is_initiator')
        .defaultTo(false)
      table.unique(['user_id', 'match_battle_id'])
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
