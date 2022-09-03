import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { CiudadEntity } from "../ciudad/ciudad.entity";
import { CulturaEntity } from '../cultura/cultura.entity';


@Entity()
export class PaisEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Column()
    nombre: string;

    @ManyToOne(() => CulturaEntity, cultura => cultura.paises)
    cultura: CulturaEntity;

    @OneToMany(() => CiudadEntity, ciudad => ciudad.pais)
    ciudades: CiudadEntity[];

}
