import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ProductoDto {

    @Field()
    codigo: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    descripcion: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    historia: string;

}