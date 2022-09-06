import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class ProductoDto {

    codigo: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;
    
    @IsString()
    @IsNotEmpty()
    historia: string;

}