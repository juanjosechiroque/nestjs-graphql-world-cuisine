import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CulturaEntity } from '../cultura/cultura.entity';

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
    @ManyToOne(() => CulturaEntity, cultura => cultura.recetas)
    cultura: CulturaEntity;
}
