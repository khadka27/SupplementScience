import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: 'About Us | Your Site Name',
  description: 'Learn about our mission to provide evidence-based information about supplements and health.',
  alternates: {
    canonical: `${baseUrl}/about`
  }
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">About Us</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-muted-foreground mb-6">
          We are dedicated to providing accurate, evidence-based information about supplements,
          nutrition, and health to help you make informed decisions about your wellness journey.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to cut through the noise and misinformation in the supplement industry
          by providing clear, scientifically-backed information that empowers individuals to make
          informed health decisions.
        </p>

        <h2>Our Approach</h2>
        <p>
          Every article on our site is thoroughly researched and backed by scientific studies.
          We believe in:
        </p>
        <ul>
          <li>Evidence-based research and reporting</li>
          <li>Transparency about sources and methodology</li>
          <li>Regular content updates to reflect the latest science</li>
          <li>Clear disclosure of any affiliations or partnerships</li>
        </ul>

        <h2>Our Team</h2>
        <p>
          Our team consists of health writers, researchers, and medical reviewers who are passionate
          about providing accurate health information. All content is reviewed by qualified professionals
          before publication.
        </p>

        <h2>Editorial Standards</h2>
        <p>
          We maintain strict editorial standards to ensure the accuracy and reliability of our content.
          Learn more about our <a href="/editorial-policy">editorial policy</a> and
          our <a href="/medical-disclaimer">medical disclaimer</a>.
        </p>

        <h2>Contact Us</h2>
        <p>
          Have questions or feedback? We would love to hear from you.
          Visit our <a href="/contact">contact page</a> to get in touch.
        </p>
      </div>
    </div>
  );
}
