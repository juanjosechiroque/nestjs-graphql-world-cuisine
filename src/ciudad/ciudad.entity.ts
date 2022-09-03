import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { PaisEntity } from "../pais/pais.entity";

@Entity()
export class CiudadEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Column()
    nombre: string;
    
    @ManyToOne(() => PaisEntity, pais => pais.ciudades)
    pais: PaisEntity;    

}
