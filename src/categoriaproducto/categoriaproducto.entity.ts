import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProductoEntity } from "../producto/producto.entity";

@Entity()
export class CategoriaproductoEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;

    @Column()
    nombre: string;

    @OneToMany(() => ProductoEntity, producto => producto.categoriaProducto)
    productos: ProductoEntity[];

}
