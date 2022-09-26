import { Field, InputType } from '@nestjs/graphql';
import {IsNotEmpty, IsString} from 'class-validator';

@InputType()
export class CategoriaproductoDto {
    @Field()
    readonly codigo: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
}
