import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductoEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;

    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    @Column()
    historia: string;
    
    //TODO: definir las relaciones (si aplica)
}
