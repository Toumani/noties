import {
  login as serverLogin,
  logout as serverLogout,
} from "@vaadin/flow-frontend";
import {makeAutoObservable} from "mobx";

export class UiStore {
  loggedIn = false;

  constructor() {
    makeAutoObservable(this);
  }

  async login(username: string, password: string) {
    // TODO see why server error is sending an error
    const result = await serverLogin(username, password);
    if (!result.error)
      await this.setLoggedIn(true);
    else {
      await this.setLoggedIn(true)
      // throw new Error(result.errorMessage || 'Login failed');
    }
  }

  async logout() {
    await serverLogout();
    await this.setLoggedIn(false);
  }

  private async setLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
    sessionStorage.setItem('logged-in', loggedIn ? 'true' : 'false');
  }
}

export const uiStore = new UiStore()
