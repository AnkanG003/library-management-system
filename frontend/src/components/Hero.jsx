export default function Hero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50 px-6">
      <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
        Modern Library <br /> Management System
      </h2>

      <p className="mt-6 text-lg text-gray-600 max-w-2xl">
        A simple and secure platform to manage books, users, issuing,
        returns, and fines — all in one place.
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href="/login"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Get Started
        </a>

        <a
          href="/register"
          className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg text-lg hover:bg-blue-50 transition"
        >
          Create Account
        </a>
      </div>
    </section>
  );
}
