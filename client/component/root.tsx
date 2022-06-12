//

import {
  IntlError
} from "@formatjs/intl";
import {
  Outlet,
  ReactLocation,
  Route,
  Router
} from "@tanstack/react-location";
import axios from "axios";
import * as queryParser from "query-string";
import * as react from "react";
import {
  ReactElement,
  useCallback
} from "react";
import {
  DndProvider
} from "react-dnd";
import {
  HTML5Backend as DndBackend
} from "react-dnd-html5-backend";
import {
  ErrorBoundary
} from "react-error-boundary";
import {
  IntlProvider
} from "react-intl";
import {
  QueryClient,
  QueryClientProvider
} from "react-query";
import {
  create
} from "/client/component/create";
import {
  globalLocale,
  useDefaultLocale,
  useDefaultMe
} from "/client/component/hook";
import InnerRoot from "/client/component/inner-root";
import EmptyPage from "/client/component/page/empty-page";
import {
  createRoute
} from "/client/component/util/route";
import ScrollTop from "/client/component/util/scroll-top";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";


require("../../node_modules/codemirror/lib/codemirror.css");
require("../../node_modules/c3/c3.css");

export async function loadDocumentSource({params}: {params: Record<string, string>}): Promise<{source: string | null}> {
  const firstPath = (params.firstPath) ? params.firstPath : "";
  const secondPath = (params.secondPath) ? "/" + params.secondPath : "";
  const locale = globalLocale;
  const path = firstPath + secondPath;
  const url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchDocument"];
  const response = await axios.post(url, {locale, path}, {validateStatus: () => true});
  if (response.status === 200 && typeof response.data === "string") {
    const source = response.data;
    return {source};
  } else {
    return {source: null};
  }
}

const location = new ReactLocation({
  parseSearch: (searchString) => queryParser.parse(searchString),
  stringifySearch: (search) => queryParser.stringify(search)
});
const queryClient = new QueryClient();
const routes = [
  ...createRoute("/login", () => import("/client/component/page/login-page"), {type: "guest", redirect: "/dashboard"}),
  ...createRoute("/register", () => import("/client/component/page/register-page"), {type: "guest", redirect: "/dashboard"}),
  ...createRoute("/reset", () => import("/client/component/page/reset-user-password-page"), {type: "guest", redirect: "/dashboard"}),
  ...createRoute("/activate", () => import("/client/component/page/activate-user-page"), {type: "none"}),
  ...createRoute("/dashboard/dictionary/:number", () => import("/client/component/page/dictionary-setting-page"), {type: "private", redirect: "/login"}),
  ...createRoute("/dashboard", () => import("/client/component/page/dashboard-page"), {type: "private", redirect: "/login"}),
  ...createRoute("/dictionary/:value", () => import("/client/component/page/dictionary-page"), {type: "none"}),
  ...createRoute("/example/:number", () => import("/client/component/page/example-page"), {type: "none"}),
  ...createRoute("/list", () => import("/client/component/page/dictionary-list-page"), {type: "none"}),
  ...createRoute("/notification", () => import("/client/component/page/notification-page"), {type: "none"}),
  ...createRoute("/contact", () => import("/client/component/page/contact-page"), {type: "none"}),
  ...createRoute("/document/:firstPath/:secondPath", () => import("/client/component/page/document-page"), {type: "none", loader: loadDocumentSource}),
  ...createRoute("/document/:firstPath", () => import("/client/component/page/document-page"), {type: "none", loader: loadDocumentSource}),
  ...createRoute("/document", () => import("/client/component/page/document-page"), {type: "none", loader: loadDocumentSource}),
  ...createRoute("/language", () => import("/client/component/page/language-page"), {type: "none"}),
  ...createRoute("/", () => import("/client/component/page/top-page"), {type: "none"})
] as Array<Route>;


const Root = create(
  require("./root.scss"), "Root",
  function ({
  }: {
  }): ReactElement | null {

    const {ready} = useDefaultMe();
    const {locale, messages} = useDefaultLocale("ja");

    const handleIntlError = useCallback(function (error: IntlError<any>): void {
      if (error.code !== "MISSING_DATA" && error.code !== "MISSING_TRANSLATION") {
        console.error(error);
      }
    }, []);

    const node = (ready) && (
      <DndProvider backend={DndBackend}>
        <QueryClientProvider client={queryClient}>
          <IntlProvider defaultLocale="ja" locale={locale} messages={messages} onError={handleIntlError} fallbackOnEmptyString={false}>
            <ErrorBoundary fallbackRender={EmptyPage}>
              <Router location={location} routes={routes} caseSensitive={true}>
                <InnerRoot>
                  <ScrollTop>
                    <Outlet/>
                  </ScrollTop>
                </InnerRoot>
              </Router>
            </ErrorBoundary>
          </IntlProvider>
        </QueryClientProvider>
      </DndProvider>
    );
    return node || null;

  }
);


export default Root;