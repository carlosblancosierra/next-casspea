const Instagram = () => (
  <section className="py-12 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-8">
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-primary-text dark:text-white">Follow us on Instagram</h2>
    <p className="mb-6 text-center text-primary-text dark:text-primary-text-light max-w-xl">See our latest creations, behind-the-scenes, and exclusive offers. Join the CassPea community!</p>
    <a
      href="https://www.instagram.com/casspea_/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-8 py-3 rounded-full bg-pink-600 text-white font-semibold shadow hover:bg-pink-700 transition-colors text-lg"
    >
      @casspea_
    </a>
  </section>
);

export default Instagram;
