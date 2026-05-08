import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EduAI — Role-Based Educational Analytics" },
      { name: "description", content: "Futuristic AI-powered educational analytics for students and teachers." },
      { property: "og:title", content: "EduAI — Role-Based Educational Analytics" },
      { name: "twitter:title", content: "EduAI — Role-Based Educational Analytics" },
      { property: "og:description", content: "Futuristic AI-powered educational analytics for students and teachers." },
      { name: "twitter:description", content: "Futuristic AI-powered educational analytics for students and teachers." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/81f9ec40-3ccf-40ad-aebb-16734949537a/id-preview-1de5d785--77c3dfa8-b428-4597-a85c-09ce0061f544.lovable.app-1778220067832.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/81f9ec40-3ccf-40ad-aebb-16734949537a/id-preview-1de5d785--77c3dfa8-b428-4597-a85c-09ce0061f544.lovable.app-1778220067832.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <p className="text-muted-foreground mt-2">Page not found</p>
        <a href="/" className="mt-4 inline-block text-primary">Go home →</a>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-6 max-w-md text-center">
          <h2 className="font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Retry</button>
        </div>
      </div>
    );
  },
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
