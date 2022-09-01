import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CiudadEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Column()
    nombre: string;
    
    //TODO: definir las relaciones (si aplica)

}
