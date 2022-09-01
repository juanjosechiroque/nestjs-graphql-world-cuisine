import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CulturaEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    //TODO: definir las relaciones (si aplica)
}
