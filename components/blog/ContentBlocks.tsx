"use client";

import { ReactNode } from "react";
import {
  Pill,
  AlertTriangle,
  Sparkles,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContentBlockProps {
  children: ReactNode;
  className?: string;
}

// Quick Summary Block
export function QuickSummary({ children, className }: ContentBlockProps) {
  return (
    <Card
      className={cn(
        "bg-[#F7ECDE] border-2 border-[#E9DAC1] transition-all shadow-sm",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Sparkles className="w-5 h-5 text-primary" />
          Quick Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </CardContent>
    </Card>
  );
}

// Benefits Block
export function BenefitsBlock({ children, className }: ContentBlockProps) {
  return (
    <Card
      className={cn(
        "bg-[#F7ECDE] border-2 border-[#E9DAC1] transition-all shadow-sm",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <TrendingUp className="w-5 h-5 text-primary" />
          Key Benefits
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </CardContent>
    </Card>
  );
}

// Dosage Block
export function DosageBlock({ children, className }: ContentBlockProps) {
  return (
    <Card
      className={cn(
        "bg-[#F7ECDE] border-2 border-[#E9DAC1] transition-all shadow-sm",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Pill className="w-5 h-5 text-primary" />
          Dosage & Timing
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </CardContent>
    </Card>
  );
}

// Side Effects / Warnings Block
export function WarningBlock({ children, className }: ContentBlockProps) {
  return (
    <Card
      className={cn(
        "bg-[#F7ECDE] border-2 border-[#E9DAC1] transition-all shadow-sm",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Warnings & Side Effects
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </CardContent>
    </Card>
  );
}

// Timeline Block (for supplement schedules)
export function TimelineBlock({ children, className }: ContentBlockProps) {
  return (
    <Card
      className={cn(
        "bg-[#F7ECDE] border-2 border-[#E9DAC1] transition-all shadow-sm",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Calendar className="w-5 h-5 text-primary" />
          Timing Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </CardContent>
    </Card>
  );
}

// Comparison Table Wrapper
interface ComparisonItem {
  name: string;
  dosage: string;
  benefits: string;
  rating: number;
}

export function ComparisonTable({ items }: { items: ComparisonItem[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Supplement Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  Supplement
                </th>
                <th className="px-4 py-3 text-left font-semibold">Dosage</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Key Benefits
                </th>
                <th className="px-4 py-3 text-left font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.dosage}</td>
                  <td className="px-4 py-3 text-sm">{item.benefits}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.rating >= 4 ? "default" : "secondary"}>
                      {item.rating}/5
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// FAQ Block
interface FAQ {
  question: string;
  answer: string;
}

export function FAQBlock({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
