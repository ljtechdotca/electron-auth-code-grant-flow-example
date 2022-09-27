declare module "*.scss";

declare module "*.svg" {
  const content: any;
  export default content;
}

interface StoreProps {
  isLoggedIn: boolean;
  error: string | null;
  token: Token | null;
}

interface App {
  type: AppType;
  clientId: string;
  clientSecret: string;
}

interface Token extends App {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  obtainmentTimestamp?: number;
}
