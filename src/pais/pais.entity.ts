import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { CiudadEntity } from "../ciudad/ciudad.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Field()
    @Column()
    nombre: string;

    @Field(type => [CiudadEntity])
    @OneToMany(() => CiudadEntity, ciudad => ciudad.pais)
    ciudades: CiudadEntity[];

}
