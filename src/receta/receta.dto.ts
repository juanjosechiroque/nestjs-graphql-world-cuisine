import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class RecetaDto {

    codigo: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsUrl()
    @IsNotEmpty()
    fotoPlato: string;

    @IsString()
    @IsNotEmpty()
    procesoPreparacion: string;

    @IsUrl()
    @IsNotEmpty()
    videoPreparacion: string;

    @IsString()
    @IsNotEmpty()
    tipoReceta: string;

}
