import {IsNotEmpty, IsString} from 'class-validator';
export class PaisDto {
    readonly codigo: string;
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
}