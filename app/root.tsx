import { ReactNode } from 'react';
import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import './global.css';
import 'app/src/i18n';
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap",
  },
];


export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Explore Stratum V2: The next generation Bitcoin mining protocol. Learn about enhanced security, reduced latency, and decentralized mining infrastructure."
        />
        <meta
          name="keywords"
          content="Stratum V2, Bitcoin Mining, Mining Protocol, Decentralized Mining"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          property="og:title"
          content="Stratum V2 - Next Generation Bitcoin Mining Protocol"
        />
        <meta
          property="og:description"
          content="Explore Stratum V2: The next generation Bitcoin mining protocol. Learn about enhanced security, reduced latency, and decentralized mining infrastructure."
        />
        <meta property="og:type" content="website" />
        <link rel="icon" type="image/svg+xml" href="/assets/sv2-icon.svg" />
        <title>Stratum V2 - Next Generation Bitcoin Mining Protocol</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function App() {
  return (

    <Outlet />

  );
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
      <Link className="text-muted-foreground underline" to="/">Go to Home</Link>
    </main>
  );
}