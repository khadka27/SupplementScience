import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: 'Editorial Policy | Your Site Name',
  description: 'Learn about our editorial standards and content creation process.',
  alternates: {
    canonical: `${baseUrl}/editorial-policy`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function EditorialPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Editorial Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-muted-foreground mb-6">
          Our editorial policy outlines the standards and principles that guide our content creation process.
        </p>

        <h2>Our Commitment to Quality</h2>
        <p>
          We are committed to providing accurate, evidence-based, and trustworthy health information.
          Our content is created with the highest standards of integrity and transparency.
        </p>

        <h2>Content Creation Process</h2>
        <h3>Research and Fact-Checking</h3>
        <ul>
          <li>All articles are thoroughly researched using peer-reviewed scientific studies</li>
          <li>We prioritize recent, high-quality research from reputable sources</li>
          <li>Claims are supported by evidence and properly cited</li>
          <li>Information is fact-checked before publication</li>
        </ul>

        <h3>Editorial Review</h3>
        <ul>
          <li>Content undergoes multiple rounds of editorial review</li>
          <li>Medical and scientific information is reviewed by qualified professionals</li>
          <li>Articles are checked for accuracy, clarity, and readability</li>
          <li>Sources are verified for credibility and relevance</li>
        </ul>

        <h2>Source Standards</h2>
        <p>We prioritize the following types of sources:</p>
        <ul>
          <li>Peer-reviewed scientific journals and studies</li>
          <li>Government health agencies and regulatory bodies</li>
          <li>Academic and medical institutions</li>
          <li>Professional medical organizations</li>
          <li>Qualified healthcare professionals and researchers</li>
        </ul>

        <h2>Content Updates</h2>
        <p>
          Health and nutrition science evolves constantly. We are committed to:
        </p>
        <ul>
          <li>Regularly reviewing and updating existing content</li>
          <li>Incorporating new research findings as they emerge</li>
          <li>Correcting errors promptly when identified</li>
          <li>Clearly marking last updated dates on all articles</li>
        </ul>

        <h2>Transparency and Disclosures</h2>
        <h3>Author Credentials</h3>
        <p>
          All authors and reviewers are identified with their relevant credentials and expertise.
        </p>

        <h3>Conflicts of Interest</h3>
        <p>
          We disclose any potential conflicts of interest, including:
        </p>
        <ul>
          <li>Affiliate relationships</li>
          <li>Sponsored content (clearly labeled)</li>
          <li>Financial relationships with supplement companies</li>
          <li>Any other relationships that could influence content</li>
        </ul>

        <h2>Editorial Independence</h2>
        <p>
          Our editorial team maintains complete independence in content creation. Commercial
          relationships do not influence our editorial decisions or the integrity of our content.
        </p>

        <h2>Advertising Standards</h2>
        <p>
          If we display advertising:
        </p>
        <ul>
          <li>Ads are clearly distinguished from editorial content</li>
          <li>Advertisers do not influence editorial content</li>
          <li>We do not endorse specific products unless clearly stated</li>
          <li>Sponsored content is clearly labeled as such</li>
        </ul>

        <h2>User-Generated Content</h2>
        <p>
          If we allow comments or user submissions:
        </p>
        <ul>
          <li>Content is moderated to ensure quality and relevance</li>
          <li>Medical advice in comments is not endorsed</li>
          <li>Spam and inappropriate content is removed</li>
          <li>User content does not reflect our editorial position</li>
        </ul>

        <h2>Corrections Policy</h2>
        <p>
          If we discover an error in our content:
        </p>
        <ul>
          <li>We correct it promptly</li>
          <li>Significant corrections are noted in the article</li>
          <li>We are transparent about changes made</li>
          <li>The last updated date is revised</li>
        </ul>

        <h2>Contact Our Editorial Team</h2>
        <p>
          If you have questions about our editorial policy, notice an error, or have feedback
          about our content, please contact us at: editorial@yoursite.com
        </p>

        <h2>Policy Updates</h2>
        <p>
          This editorial policy may be updated from time to time. Check back regularly for changes.
        </p>
      </div>
    </div>
  );
}
