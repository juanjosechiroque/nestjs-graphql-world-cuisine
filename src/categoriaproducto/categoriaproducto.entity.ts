import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProductoEntity } from "../producto/producto.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CategoriaproductoEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    codigo: string;

    @Field()
    @Column()
    nombre: string;

    @Field(type => [ProductoEntity])
    @OneToMany(() => ProductoEntity, producto => producto.categoriaProducto)
    productos: ProductoEntity[];

}
