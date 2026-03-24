import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | IG Follow Audit",
  description:
    "Privacy policy for IG Follow Audit and its companion Chrome extension.",
};

export default function PrivacyPage(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8">
      <article className="rounded-3xl border border-amber-200/70 bg-white/75 p-6 shadow-[0_12px_36px_rgba(92,65,40,0.1)] dark:border-amber-900/50 dark:bg-stone-900/60">
        <h1 className="text-4xl text-stone-900 dark:text-amber-50">Privacy Policy</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-amber-100/80">Last updated: March 23, 2026</p>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <p>
            IG Follow Audit is operated by John Ivanov. This policy explains what information is processed when you use
            the web app and companion Chrome extension.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">What Data Is Processed</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Instagram export files you choose to upload (JSON, HTML, TXT).</li>
            <li>Derived account comparison data (followers, following, not-following-back sets).</li>
            <li>Review state such as keep/unfollow/completed selections.</li>
          </ul>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">How Data Is Used</h2>
          <p>
            Data is used only to generate and display your follow-audit results and support manual workflow syncing
            between the app and extension.
          </p>
          <p>
            IG Follow Audit does not automate follow/unfollow actions, does not scrape private pages, and does not use
            unofficial Instagram APIs.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Storage and Retention</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Processing is local-first in your browser session.</li>
            <li>The extension may store synchronized payload state in Chrome local extension storage for convenience.</li>
            <li>No server-side account database is used for your parsed Instagram data.</li>
          </ul>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Analytics and Tracking</h2>
          <p>IG Follow Audit does not collect analytics or telemetry about your account data usage.</p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Contact</h2>
          <p>
            For privacy questions or requests, contact: <a className="underline" href="mailto:igtidy9@gmail.com">igtidy9@gmail.com</a>
          </p>
        </section>
      </article>
    </main>
  );
}
