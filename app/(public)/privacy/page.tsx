import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: 'Privacy Policy | Your Site Name',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
  alternates: {
    canonical: `${baseUrl}/privacy`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>Introduction</h2>
        <p>
          We respect your privacy and are committed to protecting your personal data. This privacy policy
          explains how we collect, use, and safeguard your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited,
            time spent, and navigation patterns</li>
          <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
          <li><strong>Contact Information:</strong> If you contact us or subscribe to our newsletter, we collect
            your email address and any other information you provide</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Improve and optimize our website</li>
          <li>Analyze usage patterns and trends</li>
          <li>Respond to your inquiries</li>
          <li>Send newsletters and updates (with your consent)</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience.
          You can control cookie settings through your browser preferences.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We may use third-party services for analytics, advertising, and other purposes. These services
          may collect information about your use of our website. We recommend reviewing the privacy policies
          of these third-party services.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However,
          no method of transmission over the internet is 100% secure.
        </p>

        <h2>Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal data, including
          the right to access, correct, or delete your information.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any significant
          changes by posting the new policy on this page.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this privacy policy, please contact us at:
          [Your Contact Email]
        </p>
      </div>
    </div>
  );
}
