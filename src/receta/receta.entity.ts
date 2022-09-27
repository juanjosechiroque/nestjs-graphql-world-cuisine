import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CulturaEntity } from '../cultura/cultura.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class RecetaEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    codigo: string;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    descripcion: string;
    
    @Field()
    @Column()
    fotoPlato: string;
    
    @Field()
    @Column()
    procesoPreparacion: string;
    
    @Field()
    @Column()
    videoPreparacion: string;
    
    @Field()
    @Column()
    tipoReceta: string;
    
    @Field(type => [CulturaEntity])
    @ManyToOne(() => CulturaEntity, cultura => cultura.recetas)
    cultura: CulturaEntity;
}
