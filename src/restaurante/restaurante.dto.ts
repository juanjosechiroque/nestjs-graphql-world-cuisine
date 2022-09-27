import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

@InputType()
export class RestauranteDto {

    readonly codigo: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly telefono: string;

    @Field()
    @IsUrl()
    @IsNotEmpty()
    readonly foto: string;

    @Field()
    @IsNumber()
    @IsNotEmpty()
    readonly estrellasMichelin: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly fechaConsecusion: String;

}
