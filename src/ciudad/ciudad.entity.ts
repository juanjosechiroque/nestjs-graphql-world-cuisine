import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { PaisEntity } from "../pais/pais.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CiudadEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    codigo: string;
    
    @Field()
    @Column()
    nombre: string;
    
    @Field(type => PaisEntity)
    @ManyToOne(() => PaisEntity, pais => pais.ciudades)
    pais: PaisEntity;    

}
