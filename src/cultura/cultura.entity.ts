import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RecetaEntity } from '../receta/receta.entity';

@Entity()
export class CulturaEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    //TODO: definir las relaciones (si aplica)
    @OneToMany(() => RecetaEntity, receta => receta.cultura)
    recetas: RecetaEntity[];
}
