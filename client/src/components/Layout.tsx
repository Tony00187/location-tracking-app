import { ReactNode } from "react";
import { Link } from "wouter";

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Layout({ children, fullWidth = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-medium">Location Tracker</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/">
                  <a className="text-sm text-primary hover:underline">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <a className="text-sm text-primary hover:underline">Admin</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className={`flex-grow flex items-center justify-center p-4 ${fullWidth ? '' : 'max-w-5xl mx-auto w-full'}`}>
        <div className={fullWidth ? "w-full" : "w-full max-w-md"}>
          {children}
        </div>
      </main>

      <footer className="py-4 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Location Tracker App</p>
      </footer>
    </div>
  );
}
