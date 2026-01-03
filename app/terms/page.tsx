import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: 'Terms of Service | Your Site Name',
  description: 'Terms and conditions for using our website and services.',
  alternates: {
    canonical: `${baseUrl}/terms`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using our website, you agree to be bound by these Terms of Service.
          If you disagree with any part of these terms, you may not access our website.
        </p>

        <h2>Use of Our Website</h2>
        <p>You agree to use our website only for lawful purposes and in a way that does not:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on the rights of others</li>
          <li>Harass, abuse, or harm another person</li>
          <li>Transmit any harmful code or malware</li>
          <li>Attempt to gain unauthorized access to our systems</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including text, images, graphics, logos, and software,
          is the property of Your Site Name or its content suppliers and is protected by
          copyright and other intellectual property laws.
        </p>

        <h2>User Content</h2>
        <p>
          If you submit comments, feedback, or other content to our website, you grant us
          a non-exclusive, royalty-free, perpetual license to use, modify, and display that content.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          Our website and content are provided on an "as is" basis without warranties of any kind.
          We do not guarantee that our website will be error-free or uninterrupted.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Your Site Name shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages resulting from your
          use of our website.
        </p>

        <h2>External Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for
          the content, privacy policies, or practices of these external sites.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be effective
          immediately upon posting to this page.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of
          [Your Jurisdiction], without regard to its conflict of law provisions.
        </p>

        <h2>Contact Information</h2>
        <p>
          For questions about these Terms of Service, please contact us at:
          [Your Contact Email]
        </p>
      </div>
    </div>
  );
}
