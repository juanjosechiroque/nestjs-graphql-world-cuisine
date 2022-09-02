/* eslint-disable prettier/prettier */
export function BusinessLogicException(mensaje: string, tipo: number) {
    this.mensaje = mensaje;
    this.tipo = tipo;
  }
   
  export enum BusinessError {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST
  }