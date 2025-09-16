import type { IPersona } from "./persona.interface";

export interface Usuario extends IPersona {
  id?: number;
  personaId: number;
  persona: IPersona;
}
