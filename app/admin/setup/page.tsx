import { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin Setup | SupplementScience",
  description: "Initialize your admin account",
};

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto max-w-2xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Setup</h1>
          <p className="text-lg text-muted-foreground">
            Initialize your admin account to start managing your blog
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to create your admin account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    Step 1: Initialize Admin
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Call the API endpoint to create the default admin account
                  </p>
                  <code className="block mt-2 p-3 bg-muted rounded-lg text-sm">
                    POST /api/admin/init
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    Step 2: Default Credentials
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use these credentials to login for the first time:
                  </p>
                  <div className="mt-2 p-3 bg-muted rounded-lg text-sm space-y-1">
                    <p>
                      <strong>Username:</strong> admin
                    </p>
                    <p>
                      <strong>Password:</strong> admin123
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    Step 3: Change Credentials
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    After logging in, go to Settings to change your username and
                    password
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t space-y-3">
              <form action="/api/admin/init" method="POST">
                <Button type="submit" className="w-full" size="lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Initialize Admin Account
                </Button>
              </form>

              <Link href="/admin/login">
                <Button variant="outline" className="w-full" size="lg">
                  Go to Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-400">
                <strong>⚠️ Security Note:</strong> Make sure to change the
                default password immediately after your first login!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Check the documentation or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
