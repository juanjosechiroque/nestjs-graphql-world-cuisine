import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CulturaDto {

   // @Field()
    //id: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    descripcion: string;
    
}