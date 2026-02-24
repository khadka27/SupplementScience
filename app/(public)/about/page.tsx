import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Shield,
  Users,
  BookOpen,
  CheckCircle2,
  Mail,
} from "lucide-react";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

export const metadata: Metadata = {
  title: "About Us | SupplementDecoded",
  description:
    "Learn about our mission to provide evidence-based information about supplements and health. Discover our approach to delivering scientifically-backed wellness guidance.",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: "About SupplementDecoded",
    description:
      "Evidence-based supplement and health information you can trust.",
    url: `${baseUrl}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#FBF8F1] via-[#F7ECDE] to-[#E9DAC1]  py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About SupplementDecoded
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are dedicated to providing accurate, evidence-based information
            about supplements, nutrition, and health to help you make informed
            decisions about your wellness journey.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 hover:border-[#E9DAC1] dark:hover:border-[#E9DAC1] transition-colors">
            <CardContent className="pt-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#E9DAC1]  p-3 rounded-lg">
                  <Target className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our mission is to cut through the noise and misinformation
                    in the supplement industry by providing clear,
                    scientifically-backed information that empowers individuals
                    to make informed health decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#E9DAC1] dark:hover:border-[#E9DAC1] transition-colors">
            <CardContent className="pt-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#E9DAC1]  p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Our Ethos</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We believe in transparency, scientific rigor, and putting
                    your health first. Every recommendation we make is grounded
                    in peer-reviewed research and expert medical guidance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Our Approach */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Approach
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every article on our site is thoroughly researched and backed by
              scientific studies. We believe in:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Evidence-Based Research",
                description:
                  "All content backed by peer-reviewed scientific studies",
              },
              {
                icon: Shield,
                title: "Transparent Sources",
                description:
                  "Clear citations and methodology for every claim we make",
              },
              {
                icon: CheckCircle2,
                title: "Regular Updates",
                description:
                  "Content updated to reflect the latest scientific findings",
              },
              {
                icon: Users,
                title: "Expert Review",
                description:
                  "Reviewed by qualified health professionals before publication",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="bg-[#E9DAC1]  w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary dark:text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <Card className="mb-16 bg-muted/30">
          <CardContent className="py-12">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-[#E9DAC1]  w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary dark:text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our team consists of health writers, researchers, and medical
                reviewers who are passionate about providing accurate health
                information. All content is reviewed by qualified professionals
                before publication to ensure the highest standards of accuracy
                and reliability.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Standards & Links */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary dark:text-primary" />
                Editorial Standards
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We maintain strict editorial standards to ensure the accuracy
                and reliability of our content.
              </p>
              <div className="space-y-2">
                <Link
                  href="/editorial-policy"
                  className="block text-primary hover:underline font-medium"
                >
                  → Read our Editorial Policy
                </Link>
                <Link
                  href="/medical-disclaimer"
                  className="block text-primary hover:underline font-medium"
                >
                  → View Medical Disclaimer
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-[#F7ECDE] ">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-primary dark:text-primary" />
                Get In Touch
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Have questions or feedback? We would love to hear from you.
              </p>
              <Link href="/contact">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity w-full">
                  Contact Us
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
