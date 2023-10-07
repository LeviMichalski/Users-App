import { createApp } from "vue";

import App from "./App.vue";
import UserDialog from "./components/item-resources/UserDialog.vue";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { Amplify, Auth } from "aws-amplify";
import awsmobile from "./aws-exports";

const app = createApp(App);
const vuetifyApp = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: "us-east-2",
    userPoolId: "us-east-2_sK5yucGiP",
    userPoolWebClientId: "3g11mbcm950eg18uj3d4slgi4m",
    authenticationFlowType: "USER_SRP_AUTH",
  },
});

app.use(vuetifyApp);

app.component("task-dialog", UserDialog);

app.mount("#app");
