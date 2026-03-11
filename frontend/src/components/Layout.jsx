import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1500px] mx-auto px-10 lg:px-16 py-10">
  {children}
</main>
    </div>
  );
}
