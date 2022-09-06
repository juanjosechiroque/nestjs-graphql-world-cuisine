import { IsNotEmpty, IsString } from "class-validator";

export class CulturaDto {

    id: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;
    
}