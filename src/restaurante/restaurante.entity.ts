import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    
    //TODO: definir las relaciones (si aplica)

}
