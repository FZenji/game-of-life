import Game from '@/components/GameBoard';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      <Game />
      
      <div className="fixed bottom-4 right-4 text-slate-500 text-sm">
          Developed by Henry Tolenaar
      </div>
    </main>
  );
}
