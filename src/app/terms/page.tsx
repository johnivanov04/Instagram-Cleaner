import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | IG Follow Audit",
  description: "Terms of Use for IG Follow Audit and companion extension.",
};

export default function TermsPage(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8">
      <article className="rounded-3xl border border-amber-200/70 bg-white/75 p-6 shadow-[0_12px_36px_rgba(92,65,40,0.1)] dark:border-amber-900/50 dark:bg-stone-900/60">
        <h1 className="text-4xl text-stone-900 dark:text-amber-50">Terms of Use</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-amber-100/80">Last updated: March 23, 2026</p>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <p>
            By using IG Follow Audit, you agree to these terms. If you do not agree, do not use the app or extension.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Acceptable Use</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Use only with data exported from accounts you are authorized to access.</li>
            <li>Do not use IG Follow Audit for unlawful, abusive, or harmful purposes.</li>
            <li>Do not attempt to use the product to automate prohibited platform actions.</li>
          </ul>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">No Affiliation</h2>
          <p>
            IG Follow Audit is an independent tool and is not affiliated with, endorsed by, or sponsored by Instagram or Meta.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Disclaimers</h2>
          <p>
            The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind.
          </p>
          <p>
            You are responsible for your own actions on Instagram, including any follow/unfollow decisions.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, John Ivanov is not liable for any indirect, incidental, special,
            consequential, or punitive damages, or any loss of data or profits arising from use of this service.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of California, United States, without regard to
            conflict-of-law principles.
          </p>
        </section>

        <section className="mt-6 space-y-3 text-sm leading-6 text-stone-700 dark:text-amber-100/85">
          <h2 className="text-2xl text-stone-900 dark:text-amber-50">Contact</h2>
          <p>
            Questions about these terms can be sent to: <a className="underline" href="mailto:igtidy9@gmail.com">igtidy9@gmail.com</a>
          </p>
        </section>
      </article>
    </main>
  );
}
