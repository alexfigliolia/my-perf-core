export interface IEmail {
  id: number;
  name: string;
  primary: boolean;
  verified: boolean;
  userId: number;
}

export interface GenericEmail {
  email: string;
  primary?: boolean;
  verified?: boolean;
}
