export default function Home() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Home Page</h1>
      <div className="flex flex-col w-1/2 gap-2">
        <article className="rounded-xl border p-4 dark:border-gray-700 text-white">Card 1</article>
        <article className="rounded-xl border p-4 dark:border-gray-700 text-white">Card 2</article>
        <article className="rounded-xl border p-4 dark:border-gray-700 text-white">Card 3</article>
      </div>
    </section>
  );
}
