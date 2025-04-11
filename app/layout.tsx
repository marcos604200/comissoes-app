export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="p-4 bg-gray-100 text-gray-800">{children}</body>
    </html>
  );
}