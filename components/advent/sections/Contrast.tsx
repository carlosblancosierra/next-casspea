import { COPY } from '../content';
import { Cross, MUTED, HEADING, SectionHeading, SHADOW, Tick } from './ui';

export default function Contrast() {
    const c = COPY.contrast;
    return (
        <section className="border-y border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex max-w-[1000px] flex-col gap-10 px-6 py-[72px]">
                <div className="flex flex-col gap-3 text-center">
                    <SectionHeading className={HEADING}>{c.heading}</SectionHeading>
                    <p className={`m-0 text-lg ${MUTED}`}>{c.body}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-main-bg p-7 dark:border-gray-700 dark:bg-main-bg-dark">
                        <h3 className="m-0 text-lg font-bold text-gray-600 dark:text-gray-400">{c.usualTitle}</h3>
                        <ul className="m-0 flex list-none flex-col gap-4 p-0 text-gray-600 dark:text-gray-400">
                            {c.usual.map(line => (
                                <li key={line} className="flex gap-3"><Cross /><span>{line}</span></li>
                            ))}
                        </ul>
                    </div>
                    <div className={`flex flex-col gap-4 rounded-xl border-2 border-primary bg-white p-7 dark:border-primary-light dark:bg-gray-900 ${SHADOW}`}>
                        <h3 className="m-0 text-lg font-bold text-primary dark:text-primary-light">{c.oursTitle}</h3>
                        <ul className={`m-0 flex list-none flex-col gap-4 p-0 ${HEADING}`}>
                            {c.ours.map(line => (
                                <li key={line} className="flex gap-3"><Tick /><span>{line}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
