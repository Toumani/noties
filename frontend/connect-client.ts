import {ConnectClient} from "@vaadin/flow-frontend";
import {MiddlewareContext} from "@vaadin/flow-frontend";
import {MiddlewareNext} from "@vaadin/flow-frontend";
import {uiStore} from "Frontend/stores/ui-store";
import {Router} from "@vaadin/router";

const client = new ConnectClient({
  prefix: 'connect',
  middlewares: [
    async (context: MiddlewareContext, next: MiddlewareNext) => {
      const response = await next(context);
      // Log out if the session has expired
      if (response.status === 401) {
        uiStore.logout();
        Router.go('/login');
      }
      return response;
    }
  ]
});

export default client;