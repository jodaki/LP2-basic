import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/shell";
import { WorkshopSessionProvider } from "@/lib/session";
import appCss from "../styles.css?url";

const APP_NAME = "سامانه کارگاه پلدختر";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#2F4A32" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Toaster richColors position="top-center" dir="rtl" />
          <Frame />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function Frame() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/login") return <Outlet />;
  return (
    <WorkshopSessionProvider>
      <Shell>
        <Outlet />
      </Shell>
    </WorkshopSessionProvider>
  );
}
