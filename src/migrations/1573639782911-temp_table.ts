import {MigrationInterface, QueryRunner} from "typeorm";

export class tempTable1573639782911 implements MigrationInterface {
    name = 'tempTable1573639782911'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `temp_table` ADD `created_at` datetime NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `temp_table` DROP COLUMN `created_at`", undefined);
    }

}
