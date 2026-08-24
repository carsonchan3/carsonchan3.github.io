import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import RevealMotionController from "@/components/RevealMotionController";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import WebsiteTranslationObserver from "./components/WebsiteTranslationObserver";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import People from "./pages/People";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import Equipment from "./pages/Equipment";
import Services from "./pages/Services";
import UseCases from "./pages/UseCases";
import OwnerEnquiries from "./pages/OwnerEnquiries";
import { flightDeckTheme } from "./lib/flightDeckTheme";
import { staticRouterBase } from "./lib/staticPreview";
import { chineseLocalePrefix } from "./lib/seo";
import SeoHead from "./components/SeoHead";
import type { WebsiteLanguage } from "./contexts/LanguageContext";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/contact"} component={Contact} />
      <Route path={"/"} component={Home} />
      <Route path={"/people"} component={People} />
      <Route path={"/dronesportsreferee"} component={Product} />
      <Route path={"/product"} component={Equipment} />
      <Route path={"/equipment"}>{() => <Redirect to="/product" />}</Route>
      <Route path={"/services"} component={Services} />
      <Route path={"/owner"} component={OwnerEnquiries} />
      <Route path={"/owner/enquiries"}>{() => <Redirect to="/owner" />}</Route>
      <Route path={"/use-cases"} component={UseCases} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function activeRouterBase() {
  const buildBase = staticRouterBase();
  if (typeof window === "undefined") return buildBase;
  const localeBase = window.location.pathname === chineseLocalePrefix || window.location.pathname.startsWith(`${chineseLocalePrefix}/`) ? chineseLocalePrefix : "";
  return `${buildBase}${localeBase}` || "";
}

function App({ initialLanguage, ssrPath }: { initialLanguage?: WebsiteLanguage; ssrPath?: string }) {
  return (
    <ErrorBoundary>
      <LanguageProvider initialLanguage={initialLanguage}>
        <ThemeProvider
          defaultTheme="dark"
        >
          <TooltipProvider>
            <WouterRouter base={activeRouterBase()} ssrPath={ssrPath}>
              <div className={flightDeckTheme.rootClass} data-visual-system={flightDeckTheme.name}>
                <Toaster />
                <RevealMotionController />
                <Router />
                <WebsiteTranslationObserver />
                <SeoHead />
              </div>
            </WouterRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
