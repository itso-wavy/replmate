const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative flex min-h-svh flex-col overflow-hidden scroll-smooth'>
      {children}
    </div>
  );
};

export default PublicLayout;
