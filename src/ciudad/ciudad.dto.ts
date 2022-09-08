import {IsNotEmpty, IsString} from 'class-validator';

export class CiudadDto {
    readonly codigo: string;
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
}