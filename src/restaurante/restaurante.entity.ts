import { CiudadEntity } from "../ciudad/ciudad.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class RestauranteEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    estrellasMichelin: number;

    @Field()
    @Column()
    fechaConsecusion: Date;

    @Field()
    @Column()
    descripcion: string;

    @Field()
    @Column()
    direccion: string;
    
    @Field()
    @Column()
    telefono: string;

    @Field()
    @Column()
    foto: string;

    @Field(type => [CiudadEntity])
    @OneToOne(() => CiudadEntity)
    @JoinColumn()
    ciudad: CiudadEntity

}
