import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RecetaEntity } from '../receta/receta.entity';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { ProductoEntity } from "../producto/producto.entity";

@Entity()
export class CulturaEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    @OneToMany(() => RecetaEntity, receta => receta.cultura, { 
        nullable: false, 
        cascade: true
    })
    recetas: RecetaEntity[];
    
    @ManyToMany(() => PaisEntity, { 
        nullable: true,
        cascade: false
    })
    @JoinTable()
    paises: PaisEntity[]

    @ManyToMany(() => RestauranteEntity, { 
        nullable: true,
        cascade: false
    })
    @JoinTable()
    restaurantes: RestauranteEntity[]

    @ManyToMany(() => ProductoEntity, { 
        nullable: true,
        cascade: false
    })
    @JoinTable()
    productos: ProductoEntity[]

}
