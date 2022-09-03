import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CategoriaproductoEntity } from "../categoriaproducto/categoriaproducto.entity";
import { CulturaEntity } from '../cultura/cultura.entity';


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
    
    @ManyToOne(() => CulturaEntity, cultura => cultura.paises)
    cultura: CulturaEntity;

    @ManyToOne(() => CategoriaproductoEntity, categoriaProducto => categoriaProducto.productos)
    categoriaProducto: CategoriaproductoEntity;    

}
