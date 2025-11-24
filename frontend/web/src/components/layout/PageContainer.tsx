const PageContainer: React.FC<React.PropsWithChildren> = ({ children }) => (
  <main className="flex-1 px-4 py-6 md:px-8 lg:px-12 space-y-6 bg-surface-light/60 dark:bg-slate-950/60 min-h-[calc(100vh-64px)]">
    {children}
  </main>
);

export default PageContainer;
