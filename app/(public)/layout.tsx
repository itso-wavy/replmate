const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative flex min-h-svh flex-col overflow-hidden scroll-smooth'>
      {/* before:block before:h-[64px] */}
      {children}
    </div>
  );
};

export default PublicLayout;
