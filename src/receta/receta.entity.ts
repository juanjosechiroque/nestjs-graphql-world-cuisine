import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecetaEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;
    
    @Column()
    fotoPlato: string;
    
    @Column()
    procesoPreparacion: string;
    
    @Column()
    videoPreparacion: string;
    
    @Column()
    tipoReceta: string;
    
    //TODO: definir las relaciones (si aplica)

}
