import React from "react";
import Rooter from "./navigation/Rooter";
import { ThemeProvider } from '@material-ui/core/styles'
import MainTheme from "./components/theme/MainTheme";
import CssBaseline from "@material-ui/core/CssBaseline";
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import common_en from "./translations/en/common.json";
import common_fr from "./translations/fr/common.json";
import firebase from "firebase/app";
import {config} from "./conf/firebase";

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: 'en',                              // language to use
    resources: {
        en: {
            common: common_en               // 'common' is our custom namespace
        },
        fr: {
            common: common_fr
        },
    },
});

firebase.initializeApp(config);

function App() {
  return (
      <ThemeProvider theme={MainTheme}>
          <CssBaseline/>
          <I18nextProvider i18n={i18next}>
              <Rooter/>
          </I18nextProvider>
      </ThemeProvider>
  );
}

export default App;
