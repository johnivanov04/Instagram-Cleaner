import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | IG Follow Audit",
  description: "Support and contact information for IG Follow Audit.",
};

export default function SupportPage(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8">
      <article className="rounded-3xl border border-amber-200/70 bg-white/75 p-6 shadow-[0_12px_36px_rgba(92,65,40,0.1)] dark:border-amber-900/50 dark:bg-stone-900/60">
        <h1 className="text-4xl text-stone-900 dark:text-amber-50">Support</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-amber-100/80">Last updated: March 23, 2026</p>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Contact</h2>
          <p>
            Email: <a className="underline" href="mailto:igtidy9@gmail.com">igtidy9@gmail.com</a>
          </p>
          <p>Typical response window: 2-5 business days.</p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">When You Report an Issue</h2>
          <p>Please include the following so support can reproduce quickly:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Browser version (Chrome version number).</li>
            <li>Whether you are using production (igtidy.com) or localhost.</li>
            <li>A short step-by-step reproduction sequence.</li>
            <li>Screenshots of the app or extension diagnostics panel.</li>
            <li>Any console error messages if visible.</li>
          </ul>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Common Troubleshooting</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Reload the extension from chrome://extensions after updates.</li>
            <li>Refresh both app and Instagram tabs after extension reload.</li>
            <li>Click Sync in the extension sidebar if diagnostics shows cached data only.</li>
            <li>Confirm the extension is enabled and has host permissions for the current domain.</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
