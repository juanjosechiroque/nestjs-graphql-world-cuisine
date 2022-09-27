import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RecetaEntity } from '../receta/receta.entity';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { ProductoEntity } from "../producto/producto.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaEntity {
    
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    nombre: string;
    
    @Field()
    @Column()
    descripcion: string;
    
    @Field(type => [RecetaEntity])
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
