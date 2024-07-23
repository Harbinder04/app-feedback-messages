import AuthProvider from "@/context/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "Anonymous Messenger",
  description: "Probide you feedback anonymously",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <main>{children}</main>
        </body>
      </AuthProvider>
    </html>
  );
}
