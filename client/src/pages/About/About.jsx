import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-text fade-in">
          <h1>Discover the Art of Fragrance</h1>
          <p>
            At <strong>NobleMart</strong>, we believe scent is more than just a smell —
            it’s an expression of identity. Our mission is to bring premium,
            designer-grade fragrances within reach, blending elegance with accessibility.
          </p>
        </div>
        <img
          src="/assets/fragrance-display.jpg"
          alt="Luxury perfume bottles"
          className="about-hero-image fade-in"
        />
      </section>

      <section className="about-story">
        <h2>Our Story</h2>
        <p>
          Founded with a passion for craftsmanship and detail, NobleMart began as a small
          collection of curated scents inspired by timeless classics and modern artistry.
          Today, we offer a diverse catalog featuring both niche and mainstream fragrances —
          all carefully sourced and quality-verified to ensure authenticity and longevity.
        </p>
      </section>

      <section className="about-values">
        <h2>What We Stand For</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Authenticity</h3>
            <p>Every bottle is 100% genuine — no replicas, no compromises.</p>
          </div>
          <div className="value-card">
            <h3>Transparency</h3>
            <p>We believe in clear communication, honest pricing, and open sourcing.</p>
          </div>
          <div className="value-card">
            <h3>Experience</h3>
            <p>
              From packaging to delivery, every detail is designed to feel refined,
              personal, and unforgettable.
            </p>
          </div>
        </div>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          We aim to redefine how people shop for fragrances online — combining data-driven
          recommendations, customer reviews, and exclusive collaborations to create a
          shopping experience as unique as your scent itself.
        </p>
      </section>

      <section className="about-cta">
        <h2>Find Your Signature Scent</h2>
        <p>Explore our curated collections and discover the fragrance that defines you.</p>
        <a href="/collection" className="cta-btn">Shop Now →</a>
      </section>
    </div>
  );
}
