// app/blog/why-freddo/page.tsx
import { Metadata } from 'next';
import BlogLayout from '@/components/blog/BlogLayout';

export const metadata: Metadata = {
  title: 'Why Does My Freddo Cost More Than Ever?',
  description: 'Exploring the factors behind the rising price of the Freddo chocolate frog.',
};

export default function WhyFreddoPage() {
  return (
    <BlogLayout
      title="Why Does My Freddo Cost More Than Ever?"
      date="July 12, 2025 · CassPea Newsletter #1"
      heroSrc="/blog/072025/hero.jpeg"
    >
      <p>
        Hello, and welcome to the very first CassPea newsletter. The purpose of these monthly newsletters is to inform and
        hopefully entertain. One of our core ideas at CassPea is to have fun, so with that in mind, let’s find out why the
        cost of our beloved Freddo is at an all-time high.
      </p>

      <p>
        The Freddo chocolate frog cost 10p when I arrived in the UK from Mexico back in 2000. Now, 25 years later, it costs
        31p. So what’s causing this increase? I know what you’re thinking: inflation. Well, you’re partially right —
        inflation in recent years has been much higher than usual. However, if the 10p price had simply tracked inflation
        over the past 25 years, the Freddo should only cost 19p. So where are the remaining 12p coming from?
      </p>

      <h2>The simple answer: the cost of cacao.</h2>

      <p>
        From 2020 to 2023, cacao prices varied slightly from $2.10 to $2.51 USD per kg — a 17.7% increase over three years.
        But here’s where it gets a little crazy. From 2023 to 2025, the price of cacao jumped from $2.51 to $8.42 USD — an
        astonishing 235% increase in just two years. Yes, you read that correctly: 235%. Imagine your beloved Starbucks or
        Gail’s coffee going from £3.90 to £13.07 in two years. Well, that’s how I imagine Cadbury feels with these price
        hikes — and it’s certainly how every other chocolatier I know feels.
      </p>

      <h2>What’s behind these dramatic price increases?</h2>
      <p>In short: climate change, pests, disease, corruption, and shifting consumer preferences.</p>

      <h3>Where does cacao grow?</h3>
      <p>
        First, it’s important to know where most of the world’s cacao is produced. Articles often throw in a latitude figure
        from the equator, but that doesn’t mean much to most people. So let’s make it relatable — cacao grows in
        rainforests. If you look at a map and zoom in on the countries between southern Mexico and Peru, that’s a good
        indication of where cacao can grow.
      </p>
      <p>
        According to the ICCO (International Cocoa Organization), the majority of cacao is grown in — yep, you guessed it
        — West Africa.
      </p>
      <p>
        Wait, what? I thought chocolate was a treat consumed by the mighty Mayan people of southern Mexico (I may be
        biased — that’s where my family is from). And you’d be right. But once Europeans got a taste of the good stuff,
        they established cacao plantations in West Africa, where there’s more land and a similar climate.
      </p>
      <p>
        Today, only around 20% of cacao is grown in the Americas, while 77% comes from West Africa, with Ivory Coast and
        Ghana being the largest producers.
      </p>
      <p>
        West Africa tends to grow a robust variety of cacao called Forastero, which was originally found in Brazil and the
        Amazon basin. It’s hardy and high-yielding — ideal for mass production — but it needs a lot of water.
      </p>

      <h3>How much water does chocolate need?</h3>
      <p>
        It’s estimated that between 10,000 and 30,000 litres of water are needed to produce just 1 kg of chocolate. In the
        UK, we consume around 8.1 kg of chocolate per person per year. That means, as of 2024, we’re eating an eye-watering
        548.37 million kilograms of chocolate annually. To put that into perspective: if we made a giant dark chocolate bar
        1 cm thick, it would cover the entire city of Blackpool, or half of Manchester. Crikey!
      </p>
      <p>
        <em>
          Please note: I’ve taken some liberties here, using the not-always-perfectly-reliable ChatGPT to help crunch the
          numbers.
        </em>
      </p>
      <p>
        With this in mind, it’s easier to imagine the immense quantities of water needed to satisfy just the UK’s appetite
        for chocolate. The Netherlands and Switzerland eat even more than we do — and we haven’t even mentioned the US yet.
      </p>

      <h3>Climate change and cacao</h3>
      <p>
        Unfortunately, West Africa has experienced continuous drought, rising temperatures, and increasingly
        difficult-to-control pests in recent years. These factors have put serious strain on cacao production and caused
        entire farms to go without harvests for multiple years.
      </p>
      <p>
        Excess heat has led to severe droughts in the region. Each year now seems to be the hottest on record, and West
        Africa bears much of the burden. As we’ve seen, less water means fewer cacao trees and less usable fruit. But it’s
        not just droughts causing problems — flooding is also a major issue.
      </p>
      <h4><em>Wait, wait — drought and flooding?</em></h4>
      <p>
        Yes, exactly. While parts of West Africa are drying up, others are being hit with massive rainfall — more than the
        ground can absorb. These extreme and unpredictable weather patterns have had devastating consequences. The heavy
        downpours essentially drown the cacao trees.
      </p>
      <p>
        It reminds me of when I planted an avocado tree with my grandfather in Palenque, Mexico (in the rainforest), only to
        see it die after weeks of nonstop, heavy rain.
      </p>

      <h3>Supply, demand, and the price of chocolate</h3>
      <p>
        When the world’s largest cacao producers fail to meet their quotas, supply falls and prices rise. That, in turn,
        puts pressure on smaller cacao-growing countries to expand production — which often leads to deforestation, which
        increases disease, which reduces yields, which leads to poverty in farming communities.
      </p>
      <p>See where this is going?</p>
      <p>
        Now add in consumer demand. We all want chocolate that’s Fair Trade, organic, and pesticide-free, and we expect
        companies to support fair working conditions and sustainable practices. But unfortunately, that shrinks the
        available supply of cacao even further. Like it or not, slavery and corruption remain rampant in the industry.
      </p>
      <p>
        Cacao pods must still be harvested by hand, and cheap labour is essential if we want prices to stay low and enjoy
        a 19p Freddo.
      </p>
      <p>
        Every factor we’ve discussed directly affects global cacao production — and therefore the price of chocolate.
        Sadly, West Africa is still grappling with drought, heat, pests, and disease, so it’s unlikely we’ll see chocolate
        prices fall any time soon.
      </p>

      <h2>It’s a bit gloomy, I know — but what can we do?</h2>
      <p>Well, the usual things:</p>
      <ul>
        <li>Don’t pollute more than you have to</li>
        <li>Use water wisely</li>
        <li>
          Demand better conditions for cacao workers (even if it means paying more for our delicious Freddo)
        </li>
        <li>And of course… eat CassPea Chocolates!</li>
      </ul>
      <p>
        So now you know a few of the reasons why your Freddo costs 12p more than it should.
      </p>
      <p>
        If you’ve made it this far — thank you! I’ll be back next month with another (hopefully entertaining and informative)
        edition of the CassPea newsletter.
      </p>
      <p>
        Questions, comments, or rants? Email me anytime at{' '}
        <a href="mailto:info@casspea.co.uk" className="text-pink-600 hover:underline">
          info@casspea.co.uk
        </a>
        — I check all my emails, so you’ll most likely hear back. Unless it goes to spam… in which case, you might hear
        from me in six months.
      </p>

      <hr />

      <h3>Sources:</h3>
      <ul>
        <li>
          <a href="https://www.icco.org/" target="_blank" rel="noopener noreferrer">
            https://www.icco.org/
          </a>
        </li>
        <li>
          <a
            href="https://hir.harvard.edu/bittersweet-the-harsh-realities-of-chocolate-production-in-west-africa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://hir.harvard.edu/bittersweet-the-harsh-realities-of-chocolate-production-in-west-africa/
          </a>
        </li>
        <li>
          <a href="https://croplife.org/trainingthroughlocalpartnerships/cocoa/" target="_blank" rel="noopener noreferrer">
            https://croplife.org/trainingthroughlocalpartnerships/cocoa/
          </a>
        </li>
        <li>
          <a
            href="https://wmo.int/news/media-centre/africa-faces-disproportionate-burden-from-climate-change-and-adaptation-costs"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://wmo.int/news/media-centre/africa-faces-disproportionate-burden-from-climate-change-and-adaptation-costs
          </a>
        </li>
      </ul>
    </BlogLayout>
  );
}