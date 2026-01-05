import { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: 'Contact Us | Your Site Name',
  description: 'Get in touch with our team. We would love to hear from you.',
  alternates: {
    canonical: `${baseUrl}/contact`
  }
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
      <p className="text-xl text-muted-foreground mb-12">
        Have a question, feedback, or suggestion? We would love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Us
            </CardTitle>
            <CardDescription>
              Send us an email and we will get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="mailto:contact@yoursite.com"
              className="text-lg font-medium text-primary hover:underline"
            >
              contact@yoursite.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Inquiries</CardTitle>
            <CardDescription>
              For general questions about our content or services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please allow 1-2 business days for a response.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Press</CardTitle>
            <CardDescription>
              For media inquiries and press-related questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="mailto:press@yoursite.com"
              className="text-primary hover:underline"
            >
              press@yoursite.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Opportunities</CardTitle>
            <CardDescription>
              Interested in collaborating with us?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="mailto:partnerships@yoursite.com"
              className="text-primary hover:underline"
            >
              partnerships@yoursite.com
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 prose prose-lg dark:prose-invert max-w-none">
        <h2>Before You Contact Us</h2>
        <p>
          Please note that we cannot provide personalized medical advice or supplement recommendations.
          For health-related questions, please consult with a qualified healthcare professional.
        </p>

        <h2>Response Time</h2>
        <p>
          We typically respond to inquiries within 1-2 business days. During busy periods,
          response times may be slightly longer.
        </p>
      </div>
    </div>
  );
}
