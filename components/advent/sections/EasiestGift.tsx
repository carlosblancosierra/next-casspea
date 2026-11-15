import { COPY } from '../content';
import { CARD, Icon, MUTED, HEADING, SectionHeading } from './ui';

export default function EasiestGift() {
    const g = COPY.easiestGift;
    return (
        <section className="mx-auto flex max-w-[1100px] flex-col gap-10 px-6 py-20">
            <SectionHeading className={`text-center ${HEADING}`}>{g.heading}</SectionHeading>
            <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
                {g.items.map(item => (
                    <li key={item.title} className={`flex flex-col gap-2.5 p-6 shadow-md ${CARD}`}>
                        <Icon name={item.icon} />
                        <h3 className={`m-0 text-lg font-bold ${HEADING}`}>{item.title}</h3>
                        <p className={`m-0 text-[15px] ${MUTED}`}>{item.body}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
