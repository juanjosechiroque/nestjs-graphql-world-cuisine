import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

@InputType()
export class RecetaDto {

    //@Field()
    //codigo: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @Field()
    @IsUrl()
    @IsNotEmpty()
    fotoPlato: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    procesoPreparacion: string;

    @Field()
    @IsUrl()
    @IsNotEmpty()
    videoPreparacion: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    tipoReceta: string;

}
