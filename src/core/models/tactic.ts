import { formation } from "./formation";

export class tactic{
    idTactic?: number;
    nameTactic!: string;
    descriptionTactic!: string;
    photoTactic!: string  ;
    videoTactic!: string |null ;

    formation? : formation |null;
  }
