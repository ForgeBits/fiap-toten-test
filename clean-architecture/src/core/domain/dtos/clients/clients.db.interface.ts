export interface ClientsCreateInterface {
  name: string;
  email: string;
  document: string;
}

export interface IdentifyClientInterface {
  document: string;
  email?: string;
}
