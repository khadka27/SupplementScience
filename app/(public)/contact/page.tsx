import { Metadata } from "next";
import {
  Mail,
  MessageSquare,
  Briefcase,
  Clock,
  AlertCircle,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";

export const metadata: Metadata = {
  title: "Contact Us | SupplementScience",
  description:
    "Get in touch with our team. We would love to hear from you. Contact us for general inquiries, media requests, or partnership opportunities.",
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact SupplementScience",
    description: "Get in touch with our team. We would love to hear from you.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-green-700 dark:text-green-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or suggestion? We would love to hear from
            you.
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Email Us */}
          <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-xl">
            <CardContent className="pt-8 pb-6">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send us an email and we will get back to you as soon as
                possible.
              </p>
              <a
                href="mailto:contact@yoursite.com"
                className="text-primary hover:underline font-medium inline-flex items-center gap-2"
              >
                contact@yoursite.com
                <Send className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>

          {/* General Inquiries */}
          <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-xl">
            <CardContent className="pt-8 pb-6">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-700 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">General Inquiries</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For general questions about our content or services.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Response in 1-2 business days</span>
              </div>
            </CardContent>
          </Card>

          {/* Media & Press */}
          <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-xl">
            <CardContent className="pt-8 pb-6">
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-700 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Media & Press</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For media inquiries and press-related questions.
              </p>
              <a
                href="mailto:press@yoursite.com"
                className="text-primary hover:underline font-medium inline-flex items-center gap-2"
              >
                press@yoursite.com
                <Send className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>

          {/* Partnership Opportunities */}
          <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-xl md:col-span-2 lg:col-span-1">
            <CardContent className="pt-8 pb-6">
              <div className="bg-amber-100 dark:bg-amber-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-amber-700 dark:text-amber-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Partnership Opportunities
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Interested in collaborating with us?
              </p>
              <a
                href="mailto:partnerships@yoursite.com"
                className="text-primary hover:underline font-medium inline-flex items-center gap-2"
              >
                partnerships@yoursite.com
                <Send className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>

          {/* Contact Expert */}
          <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-xl md:col-span-2">
            <CardContent className="pt-8 pb-6">
              <div className="bg-teal-100 dark:bg-teal-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-teal-700 dark:text-teal-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Contact Expert</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have technical or specialized questions? Reach out to our expert
                team for detailed guidance.
              </p>
              <a
                href="mailto:expert@yoursite.com"
                className="text-primary hover:underline font-medium inline-flex items-center gap-2"
              >
                expert@yoursite.com
                <Send className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg mt-1">
                  <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Before You Contact Us
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Please note that we cannot provide personalized medical
                    advice or supplement recommendations. For health-related
                    questions, please consult with a qualified healthcare
                    professional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mt-1">
                  <Clock className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Response Time</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We typically respond to inquiries within 1-2 business days.
                    During busy periods, response times may be slightly longer.
                    Thank you for your patience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Looking for Health Information?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Browse our comprehensive library of evidence-based articles on
              supplements, nutrition, and wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Browse Articles
                </button>
              </Link>
              <Link href="/categories">
                <button className="px-8 py-3 border-2 border-border rounded-full font-semibold hover:bg-accent transition-colors">
                  View Categories
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
