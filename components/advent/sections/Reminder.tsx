import EmailCapture from '../EmailCapture';
import { COPY } from '../content';
import { MUTED, HEADING } from './ui';

/** The soft capture half way down the shop variant. */
export default function Reminder() {
    const r = COPY.reminder;
    return (
        <section className="mx-auto max-w-[760px] px-6 pt-20">
            <div className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-primary-light bg-white p-8 dark:bg-gray-900">
                <h2 className={`m-0 font-playfair text-2xl font-bold sm:text-[28px] ${HEADING}`}>{r.heading}</h2>
                <p className={`m-0 ${MUTED}`}>{r.body}</p>
                <EmailCapture source="landing-reminder" buttonLabel={r.button} doneMessage={r.done} />
            </div>
        </section>
    );
}
