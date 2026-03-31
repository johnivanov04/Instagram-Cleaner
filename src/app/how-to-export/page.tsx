import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How To Export Data | IG Follow Audit",
  description: "Detailed Instagram export instructions for followers and following files.",
};

export default function HowToExportPage(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8">
      <article className="rounded-3xl border border-amber-200/70 bg-white/75 p-6 shadow-[0_12px_36px_rgba(92,65,40,0.1)] dark:border-amber-900/50 dark:bg-stone-900/60">
        <h1 className="text-4xl text-stone-900 dark:text-amber-50">How To Export Instagram Data</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-amber-100/80">Last updated: March 31, 2026</p>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <p>
            Follow these exact steps in Instagram to generate the export files needed by IG Follow Audit.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Go to Instagram Settings.</li>
            <li>Open Account Center.</li>
            <li>Go to Your information and permissions.</li>
            <li>Click Export information.</li>
            <li>Click Create export.</li>
            <li>Choose Export to device.</li>
            <li>Click Customize information.</li>
            <li>Unselect everything except Followers and Following.</li>
            <li>Set Date range to All time.</li>
            <li>Set Format to JSON (not HTML).</li>
            <li>Click Start export.</li>
          </ol>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">After You Start Export</h2>
          <p>
            Once Instagram finishes preparing your export, download the files and return to IG Follow Audit to
            upload them. Keep only followers and following data selected and use JSON format for the most reliable
            parsing.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-amber-50 shadow-[0_8px_20px_rgba(41,29,22,0.2)] transition hover:bg-stone-800 dark:bg-amber-200 dark:text-stone-900 dark:hover:bg-amber-100"
          >
            Back to upload
          </Link>
          <Link
            href="/how-to"
            className="inline-flex items-center justify-center rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-amber-200 dark:bg-stone-700 dark:text-amber-50 dark:hover:bg-stone-600"
          >
            Full how-to guide
          </Link>
        </div>
      </article>
    </main>
  );
}