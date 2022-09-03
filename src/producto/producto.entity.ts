import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CategoriaproductoEntity } from "../categoriaproducto/categoriaproducto.entity";

@Entity()
export class ProductoEntity {

    @PrimaryGeneratedColumn("uuid")
    codigo: string;

    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    @Column()
    historia: string;
    
    @ManyToOne(() => CategoriaproductoEntity, categoriaProducto => categoriaProducto.productos)
    categoriaProducto: CategoriaproductoEntity;    
}
