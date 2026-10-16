/// <reference types="vite-plugin-pwa/react" />

declare module "react-multi-date-picker";
declare module "react-multi-date-picker/plugins/toolbar" {
  const Toolbar: any;
  export default Toolbar;
}
declare module "react-date-object";
declare module "react-date-object/calendars/persian";
declare module "react-date-object/calendars/gregorian";
declare module "react-date-object/locales/persian_fa";
declare module "react-date-object/locales/gregorian_en";

interface ImportMetaEnv {
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
