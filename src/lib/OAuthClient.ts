import OpinionatedOAuth from "client-oauth2";
import { shell } from "electron";
import { WebServer } from "./WebServer";

type AppType = "discord" | "spotify" | "twitch";

const oAuthOptions: Record<AppType, any> = {
  discord: {
    accessTokenUri: "https://discord.com/api/oauth2/token",
    authorizationUri: "https://discord.com/api/oauth2/authorize",
    scopes: [],
  },
  spotify: {
    accessTokenUri: "https://accounts.spotify.com/api/token",
    authorizationUri: "https://accounts.spotify.com/authorize",
    scopes: [["user-read-currently-playing"]],
  },
  twitch: {
    accessTokenUri: "https://id.twitch.tv/oauth2/token",
    authorizationUri: "https://id.twitch.tv/oauth2/authorize",
    scopes: [
      "chat:edit",
      "chat:read",
      "bits:read",
      "channel:moderate",
      "channel:read:redemptions",
      "channel:read:subscriptions",
      "user:read:follows",
    ],
  },
};

export class OAuthClient {
  port: number;
  private _webServer: WebServer;

  constructor(port: number) {
    this.port = port;
    this._webServer = new WebServer(this.port);
  }

  private _createOptions({ type, clientId, clientSecret }: App) {
    const { accessTokenUri, authorizationUri, scopes } =
      oAuthOptions[type as AppType];

    const options = {
      clientId,
      clientSecret,
      scopes,
      accessTokenUri,
      authorizationUri,
      redirectUri: `http://localhost:${this.port}`,
      query: {
        client_id: clientId,
        client_secret: clientSecret,
      },
    };

    return options;
  }

  async init(
    app: App,
    onSuccess: (auth: Token) => void,
    onError: (message: string) => void
  ) {
    const options = this._createOptions(app);
    const oAuth = new OpinionatedOAuth(options);
    const authUri = oAuth.code.getUri();
    this._webServer.start();
    this._webServer.once("redirected", (uri) =>
      this.handleRedirect(app, oAuth, uri, onSuccess, onError)
    );
    shell.openExternal(authUri);
    setTimeout(() => {
      if (this._webServer.isRunning) {
        this._webServer.stop("OAuthClient has timed out!");
        onError("OAuthClient has timed out!");
      }
    }, 4 * 1000);
  }

  async handleRedirect(
    app: App,
    oAuth: OpinionatedOAuth,
    uri: string,
    onSuccess: (token: Token) => void,
    onError: (error: string) => void
  ) {
    if (this._webServer.isRunning) {
      this._webServer.stop("OAuthClient is redirecting!");
    }
    try {
      const {
        data: { access_token, refresh_token, expires_in, obtainment_timestamp },
      } = await oAuth.code.getToken(uri);
      const token = {
        ...app,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: Number(expires_in),
        obtainmentTimestamp: Number(obtainment_timestamp),
      };
      console.log("OAuthClient access granted!");
      onSuccess(token);
    } catch (error) {
      console.error(error);
      onError("OAuthClient access denied!");
    }
  }
}

export const oAuthClient = new OAuthClient(6969);
