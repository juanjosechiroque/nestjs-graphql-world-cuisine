import { CiudadEntity } from "../ciudad/ciudad.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RestauranteEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Column()
    nombre: string;

    @Column()
    estrellasMichelin: number;

    @Column()
    fechaConsecusion: Date;

    @Column()
    descripcion: string;

    @Column()
    direccion: string;
    
    @Column()
    telefono: string;

    @Column()
    foto: string;

    @OneToOne(() => CiudadEntity)
    @JoinColumn()
    ciudad: CiudadEntity

}
