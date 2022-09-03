import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CulturaEntity } from '../cultura/cultura.entity';

@Entity()
export class PaisEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Column()
    nombre: string;
    
    //TODO: definir las relaciones (si aplica)
    @ManyToOne(() => CulturaEntity, cultura => cultura.paises)
    cultura: CulturaEntity;
}
