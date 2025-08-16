export default function BlueThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-center px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-700 dark:text-blue-300">Thank you for subscribing!</h1>
      <p className="text-lg md:text-xl mb-6 text-gray-800 dark:text-gray-200">Your entry was successful. Here is your exclusive code:</p>
      <div className="text-2xl md:text-3xl font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-6 py-3 rounded-lg shadow mb-4 select-all">
        LandingBlue20
      </div>
      <p className="text-base text-gray-600 dark:text-gray-400">Use this code at checkout for 20% off your first order. Check your email for confirmation and more details!</p>
    </main>
  );
}
