import {MigrationInterface, QueryRunner} from "typeorm";

export class tempTable1573639704877 implements MigrationInterface {
    name = 'tempTable1573639704877'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `temp_table` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `temp_table`", undefined);
    }

}
