import Image from "next/image";
import { ArrowDownRight, ArrowRight, Bell, Binoculars, Check, Heart, Music2, Search, ShieldCheck, Sparkles, Ticket, Trophy } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header container">
        <a href="#" className="wordmark" aria-label="StubSpy home"><span className="brand-icon"><Binoculars aria-hidden="true" /></span>StubSpy<span className="brand-dot">.</span></a>
        <nav aria-label="Main navigation"><a className="nav-link" href="#how-it-works">How it works</a><a className="nav-cta" href="#waitlist">Get early access <ArrowRight className="angled-arrow" aria-hidden="true" /></a></nav>
      </header>
      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="launch-badge"><span /> COMING SOON · MADE FOR THE FANS</div>
            <h1 id="hero-title">Big nights.<br /><span>Smaller prices.</span></h1>
            <p className="hero-description">Your next unforgettable night shouldn’t cost a fortune. We’re building a smarter way to track resale ticket prices—and catch the drop.</p>
            <div className="hero-tags"><span><Check /> Your events</span><span><Check /> Your seats</span><span><Check /> Your price</span></div>
            <div id="waitlist" className="waitlist-block">
              <div className="waitlist-heading"><Sparkles /> Good things are coming. Get first dibs.</div>
              <WaitlistForm configured={Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY)} />
            </div>
          </div>
          <div className="hero-art" aria-label="StubSpy mascot with an illustrative ticket price drop">
            <div className="scout-orbit" />
            <div className="art-spark spark-one" aria-hidden="true">✦</div><div className="art-spark spark-two" aria-hidden="true">✧</div>
            <span className="category-bubble music-bubble"><Music2 aria-hidden="true" /><span className="sr-only">Concerts</span></span>
            <span className="category-bubble sport-bubble"><Trophy aria-hidden="true" /><span className="sr-only">Sports</span></span>
            <Image className="scout-image" src="/stubspy-scout.png" alt="A friendly blue ticket scout looking for price drops through binoculars" width={1254} height={1254} priority sizes="(max-width: 700px) 100vw, 580px" />
            <div className="scout-note"><Binoculars /> Always on the lookout.</div>
            <div className="price-alert">
              <div className="alert-icon"><Bell /></div>
              <div className="alert-content"><div className="alert-title">Psst… price drop spotted! <span>DEMO</span></div><p>Your favorite artist · Section 102</p><div className="alert-price"><s>$180</s><ArrowRight /><strong>$124</strong><span><ArrowDownRight /> 31% less</span></div></div>
            </div>
            <p className="art-caption">A sneak peek at your future notifications.</p>
          </div>
        </section>
        <div className="event-strip container"><span>MORE “I WAS THERE.” LESS “HOW MUCH?”</span><div><span><Music2 /> Concerts</span><i /><span><Trophy /> Sports</span><i /><span><Ticket /> Theater</span><i /><span><Heart /> Your next memory</span></div></div>
        <section id="how-it-works" className="how-section container" aria-labelledby="how-title">
          <div className="section-heading"><div><p className="eyebrow">YOU MAKE THE PLANS. WE KEEP WATCH.</p><h2 id="how-title">Less refreshing. More living.</h2></div><p>Your ticket to better timing.<br />Here’s what we’re working on.</p></div>
          <div className="steps">
            <article className="step-card step-blue"><div className="step-top"><span className="step-icon"><Search /></span><span className="step-number">01</span></div><h3>Find your can’t-miss.</h3><p>The artist you know every word to. The game you have to see. Pick your event.</p></article>
            <article className="step-card step-purple"><div className="step-top"><span className="step-icon"><Ticket /></span><span className="step-number">02</span></div><h3>Set your sweet spot.</h3><p>Choose your section and target price. We’ll keep an eye on the secondary market.</p></article>
            <article className="step-card step-mint"><div className="step-top"><span className="step-icon"><Bell /></span><span className="step-number">03</span></div><h3>Catch the price drop.</h3><p>Get a heads-up when tickets hit your budget. Head to the seller and make it a night.</p></article>
          </div>
          <p className="independent-note"><ShieldCheck /> An independent price tracker. You’ll buy directly from the ticket marketplace.</p>
        </section>
      </main>
      <footer className="site-footer container"><a href="#" className="wordmark footer-wordmark"><Binoculars aria-hidden="true" /> StubSpy<span className="brand-dot">.</span></a><p>For the fans. For the memories.</p><span>© {new Date().getFullYear()} StubSpy</span></footer>
    </div>
  );
}
