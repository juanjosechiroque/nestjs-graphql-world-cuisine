import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CategoriaproductoEntity } from "../categoriaproducto/categoriaproducto.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductoEntity {

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
    historia: string;

    @Field(type => [CategoriaproductoEntity])
    @ManyToOne(() => CategoriaproductoEntity, categoriaProducto => categoriaProducto.productos)
    categoriaProducto: CategoriaproductoEntity;    

}
