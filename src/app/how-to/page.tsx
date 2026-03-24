import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How To Use | IG Follow Audit",
  description: "Step-by-step setup and usage guide for IG Follow Audit and extension.",
};

export default function HowToPage(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8">
      <article className="rounded-3xl border border-amber-200/70 bg-white/75 p-6 shadow-[0_12px_36px_rgba(92,65,40,0.1)] dark:border-amber-900/50 dark:bg-stone-900/60">
        <h1 className="text-4xl text-stone-900 dark:text-amber-50">How To Use</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-amber-100/80">Last updated: March 23, 2026</p>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">1. Install the Chrome Extension</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Open chrome://extensions and enable Developer Mode.</li>
            <li>Click Load unpacked and select the extension folder.</li>
            <li>Confirm IG Follow Audit Helper is enabled.</li>
          </ol>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">2. Upload Instagram Export Files</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Open the app at https://igtidy.com.</li>
            <li>Upload followers and following export files.</li>
            <li>Review generated rows and mark accounts to keep or unfollow.</li>
          </ol>
          <p className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-3 py-2 text-xs dark:border-amber-800/80 dark:bg-stone-900/40">
            Screenshot placeholder: Upload panel with supported file formats and drag/drop area.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">3. Use the Extension on Instagram</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Open https://www.instagram.com in another tab.</li>
            <li>Click the IG Audit floating button to open the sidebar.</li>
            <li>Use Sync, Open profile, and Mark Completed to track progress.</li>
          </ol>
          <p className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-3 py-2 text-xs dark:border-amber-800/80 dark:bg-stone-900/40">
            Screenshot placeholder: Extension sidebar with Diagnostics and Selector Health sections.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">4. Complete Actions Manually</h2>
          <p>
            IG Follow Audit does not auto-unfollow. You manually review and complete actions on Instagram, then mark
            them completed in the extension/app workflow.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Troubleshooting</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>If sync looks stale, click Sync in the extension sidebar.</li>
            <li>Reload extension and refresh tabs after updating code.</li>
            <li>Check Support page if diagnostics still do not update.</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
