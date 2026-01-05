import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Stethoscope,
  Shield,
  UserCheck,
  Pill,
  AlertCircle,
  FileWarning,
  Mail,
} from "lucide-react";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";

export const metadata: Metadata = {
  title: "Medical Disclaimer | SupplementScience",
  description:
    "Important medical disclaimer regarding the health information provided on our website. Consult healthcare professionals for medical advice.",
  alternates: {
    canonical: `${baseUrl}/medical-disclaimer`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-amber-100 dark:bg-amber-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-700 dark:text-amber-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Medical Disclaimer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read this disclaimer carefully before using our website or
            following any information provided.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Important Notice */}
        <Card className="mb-12 border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-700 dark:text-amber-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-amber-900 dark:text-amber-100">
                  Important Notice
                </h2>
                <p className="text-amber-900 dark:text-amber-100 leading-relaxed font-medium">
                  The information on this website is for educational purposes
                  only and is NOT a substitute for professional medical advice,
                  diagnosis, or treatment. Always consult your physician before
                  taking any supplements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Points Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow border-2">
            <CardContent className="pt-8">
              <div className="bg-red-100 dark:bg-red-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileWarning className="w-6 h-6 text-red-700 dark:text-red-300" />
              </div>
              <h3 className="font-bold mb-2">Not Medical Advice</h3>
              <p className="text-sm text-muted-foreground">
                Content is informational only, not medical advice
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-2">
            <CardContent className="pt-8">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-6 h-6 text-blue-700 dark:text-blue-300" />
              </div>
              <h3 className="font-bold mb-2">Consult Professionals</h3>
              <p className="text-sm text-muted-foreground">
                Always seek qualified healthcare advice
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-2">
            <CardContent className="pt-8">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="font-bold mb-2">Individual Results Vary</h3>
              <p className="text-sm text-muted-foreground">
                Effects differ based on personal factors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
        {/* Content Sections */}
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <FileWarning className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    General Information Only
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The content on this website is provided for general informational
                and educational purposes only. It is not intended to be a
                substitute for professional medical advice, diagnosis, or
                treatment.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-700 dark:text-red-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Not Medical Advice</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The information on this website should not be considered medical
                advice. We are not healthcare providers, and nothing on this
                website should be construed as medical advice or as an attempt to
                practice medicine.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Consult Healthcare Professionals
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Always seek the advice of your physician or other qualified health
                provider with any questions you may have regarding a medical
                condition or supplement use. Never disregard professional medical
                advice or delay seeking it because of something you have read on
                this website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <UserCheck className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Individual Results May Vary
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The effects of supplements and health interventions can vary
                significantly from person to person. Individual results may differ
                based on various factors including age, health status, genetics,
                lifestyle, and other individual circumstances.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/30">
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                  <Pill className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Product Safety</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Before taking any supplement or making changes to your health
                regimen:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">
                    •
                  </span>
                  <span>
                    Consult with your healthcare provider, especially if you have
                    existing medical conditions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">
                    •
                  </span>
                  <span>
                    Inform your doctor about all medications and supplements you
                    are currently taking
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">
                    •
                  </span>
                  <span>
                    Be aware of potential drug interactions and contraindications
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">
                    •
                  </span>
                  <span>Follow recommended dosages and usage guidelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">
                    •
                  </span>
                  <span>Monitor for any adverse reactions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/30">
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-700 dark:text-red-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Medical Emergencies</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                If you think you may have a medical emergency, call your doctor or
                emergency services immediately. Do not rely on information from
                this website in emergency situations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-teal-700 dark:text-teal-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Research-Based Information
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to provide accurate, evidence-based information
                supported by scientific research, nutritional science is
                constantly evolving. New research may contradict or supersede
                information presented on this website.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4">No Guarantees</h2>
              <p className="text-muted-foreground leading-relaxed">
                We make no guarantees, warranties, or representations regarding
                the accuracy, completeness, or timeliness of the content on this
                website. Health information can change rapidly as new research
                emerges.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4">FDA Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                Statements regarding dietary supplements have not been evaluated
                by the Food and Drug Administration and are not intended to
                diagnose, treat, cure, or prevent any disease or health condition.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4">
                Third-Party Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may reference or link to third-party websites, research
                studies, or other sources. We are not responsible for the accuracy
                or reliability of third-party information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Limitation of Liability
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, we disclaim all liability
                for any injury, loss, or damage resulting from your use of this
                website or reliance on any information provided herein.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Card */}
        <Card className="mt-12 border-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-amber-100 dark:bg-amber-900 p-4 rounded-full">
                <Mail className="w-8 h-8 text-amber-700 dark:text-amber-300" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Questions?</h3>
                <p className="text-muted-foreground">
                  If you have questions about this medical disclaimer, please
                  contact us.
                </p>
              </div>
              <Link href="/contact">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Contact Us
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
