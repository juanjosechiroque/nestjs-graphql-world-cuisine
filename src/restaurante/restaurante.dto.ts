import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class RestauranteDto {

    readonly codigo: string;
    
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

    @IsString()
    @IsNotEmpty()
    readonly telefono: string;

    @IsUrl()
    @IsNotEmpty()
    readonly foto: string;

    @IsNumber()
    @IsNotEmpty()
    readonly estrellasMichelin: number;

    @IsString()
    @IsNotEmpty()
    readonly fechaConsecusion: Date;

}
