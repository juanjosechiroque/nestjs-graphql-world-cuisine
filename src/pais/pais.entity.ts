import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { CiudadEntity } from "../ciudad/ciudad.entity";


@Entity()
export class PaisEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Column()
    nombre: string;

    @OneToMany(() => CiudadEntity, ciudad => ciudad.pais)
    ciudades: CiudadEntity[];

}
