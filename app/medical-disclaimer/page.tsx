import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: 'Medical Disclaimer | Your Site Name',
  description: 'Important medical disclaimer regarding the health information provided on our website.',
  alternates: {
    canonical: `${baseUrl}/medical-disclaimer`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Medical Disclaimer</h1>
        <p className="text-lg text-amber-900 dark:text-amber-100">
          Please read this disclaimer carefully before using our website or following any information provided.
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h2>General Information Only</h2>
        <p>
          The content on this website is provided for general informational and educational purposes only.
          It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
        </p>

        <h2>Not Medical Advice</h2>
        <p>
          The information on this website should not be considered medical advice. We are not healthcare
          providers, and nothing on this website should be construed as medical advice or as an attempt
          to practice medicine.
        </p>

        <h2>Consult Healthcare Professionals</h2>
        <p>
          Always seek the advice of your physician or other qualified health provider with any questions
          you may have regarding a medical condition or supplement use. Never disregard professional
          medical advice or delay seeking it because of something you have read on this website.
        </p>

        <h2>Individual Results May Vary</h2>
        <p>
          The effects of supplements and health interventions can vary significantly from person to person.
          Individual results may differ based on various factors including age, health status, genetics,
          lifestyle, and other individual circumstances.
        </p>

        <h2>Product Safety</h2>
        <p>
          Before taking any supplement or making changes to your health regimen:
        </p>
        <ul>
          <li>Consult with your healthcare provider, especially if you have existing medical conditions</li>
          <li>Inform your doctor about all medications and supplements you are currently taking</li>
          <li>Be aware of potential drug interactions and contraindications</li>
          <li>Follow recommended dosages and usage guidelines</li>
          <li>Monitor for any adverse reactions</li>
        </ul>

        <h2>Medical Emergencies</h2>
        <p>
          If you think you may have a medical emergency, call your doctor or emergency services immediately.
          Do not rely on information from this website in emergency situations.
        </p>

        <h2>Research-Based Information</h2>
        <p>
          While we strive to provide accurate, evidence-based information supported by scientific research,
          nutritional science is constantly evolving. New research may contradict or supersede information
          presented on this website.
        </p>

        <h2>No Guarantees</h2>
        <p>
          We make no guarantees, warranties, or representations regarding the accuracy, completeness,
          or timeliness of the content on this website. Health information can change rapidly as new
          research emerges.
        </p>

        <h2>FDA Disclaimer</h2>
        <p>
          Statements regarding dietary supplements have not been evaluated by the Food and Drug
          Administration and are not intended to diagnose, treat, cure, or prevent any disease or
          health condition.
        </p>

        <h2>Third-Party Information</h2>
        <p>
          We may reference or link to third-party websites, research studies, or other sources.
          We are not responsible for the accuracy or reliability of third-party information.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we disclaim all liability for any injury, loss,
          or damage resulting from your use of this website or reliance on any information provided herein.
        </p>

        <h2>Updates to Disclaimer</h2>
        <p>
          We reserve the right to update this medical disclaimer at any time. Your continued use of
          this website constitutes acceptance of the current disclaimer.
        </p>

        <h2>Questions</h2>
        <p>
          If you have questions about this medical disclaimer, please contact us at:
          [Your Contact Email]
        </p>
      </div>
    </div>
  );
}
