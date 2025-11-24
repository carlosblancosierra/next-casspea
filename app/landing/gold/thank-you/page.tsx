export default function GoldThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center mt-[10%] bg-white dark:bg-main-bg-dark text-center px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-yellow-700 dark:text-yellow-300">Thank you for subscribing!</h1>
      <p className="text-lg md:text-xl mb-6 secondary-text dark:secondary-text">Your entry was successful. Here is your exclusive code:</p>
      <div className="text-2xl md:text-3xl font-mono font-bold bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-6 py-3 rounded-lg shadow mb-4 select-all">
        LandingGold20
      </div>
      <p className="text-base secondary-text dark:secondary-text">Use this code at checkout for 20% off your first order. Check your email for confirmation and more details!</p>
    </main>
  );
}
