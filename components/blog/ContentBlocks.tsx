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
        "bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-400">
          <Sparkles className="w-5 h-5" />
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
        "bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
          <TrendingUp className="w-5 h-5" />
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
        "bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-400">
          <Pill className="w-5 h-5" />
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
        "bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5" />
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
        "bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-400">
          <Calendar className="w-5 h-5" />
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
