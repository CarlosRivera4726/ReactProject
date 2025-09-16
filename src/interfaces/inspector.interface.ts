import type { Location } from "./location.interface";
import type { IPersona } from "./persona.interface";

export interface Inspector extends IPersona {
  id: number;
  persona: IPersona;
  personaId: number;
  location: Location;
  locationId: number;
}
