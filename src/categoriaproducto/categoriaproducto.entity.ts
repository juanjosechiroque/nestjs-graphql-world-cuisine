import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CategoriaproductoEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;

    @Column()
    nombre: string;

}
