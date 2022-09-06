import {IsNotEmpty, IsString} from 'class-validator';

export class CategoriaproductoDto {
    readonly codigo: string;
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
}
