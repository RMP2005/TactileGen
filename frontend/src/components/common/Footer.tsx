export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/50 bg-zinc-950 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <p>Built with PyTorch, Next.js, and genuine care for accessibility.</p>
        <p>© {new Date().getFullYear()} TactileGen. All rights reserved.</p>
      </div>
    </footer>
  );
}
