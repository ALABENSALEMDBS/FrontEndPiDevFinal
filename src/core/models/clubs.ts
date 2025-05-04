// export class Clubs {
//     idClub!: number;
//     nameClub!: string;
//     emailClub!: string;
//     adressClub!: string;
//     dateClub !: string;
//     licenceClub!: string;

//     logo!: string;

//     mediaUrl!: string;
  
//   }
  




export class Clubs {
  idClub!: number;
  nameClub!: string;
  emailClub!: string;
  adressClub!: string;
  dateClub!: string;
  licenceClub!: number;
  logo?: any; // For storing binary image data
  mediaUrl?: string; // For storing image path like "./uploadss\1746393725576.jpg"

  // Computed property for displaying the logo
  get logoUrl(): string {
    if (this.mediaUrl) {
      // Extract filename from path
      const cleanFilename = this.mediaUrl.replace(/^\.\/uploadss\\/i, '');
      return `http://localhost:8089/PiDevBackEndProject/club/uploads/${cleanFilename}`;
    }
    return 'assets/images/default-club-logo.png'; // Default logo
  }
}