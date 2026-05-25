export const metadata = {
  title: 'API Docs',
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
