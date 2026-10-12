"use client";

import { useState, useEffect } from "react";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle,
  EyeOff,
  Power,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";

interface ServiceTokenItem {
  id: string;
  name: string;
  tokenHint: string;
  description: string | null;
  expiresAt: string | null;
  lastUsedAt: string | null;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  isExpired: boolean;
  daysUntilExpiration: number | null;
}

export function ServiceTokenManager() {
  const [tokens, setTokens] = useState<ServiceTokenItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Generator form state
  const [tokenName, setTokenName] = useState("");
  const [tokenDesc, setTokenDesc] = useState("");
  const [expiresIn, setExpiresIn] = useState("30d");
  const [customDate, setCustomDate] = useState("");

  // One-time reveal modal state
  const [newlyCreatedToken, setNewlyCreatedToken] = useState<{
    token: string;
    name: string;
    expiresAt: string | null;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCurlCopied, setIsCurlCopied] = useState(false);

  // Live test state
  const [testingTokenId, setTestingTokenId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    data?: any;
    error?: string;
  } | null>(null);

  // Fetch tokens
  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/service-tokens");
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
      } else {
        const err = await res.json();
        setMessage({
          type: "error",
          text: err.error || "Failed to load service tokens",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error loading tokens" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  // Handle Token Generation
  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName.trim()) {
      setMessage({ type: "error", text: "Please enter a token name" });
      return;
    }

    setIsGenerating(true);
    setMessage(null);

    const payloadExpiry = expiresIn === "custom" ? customDate : expiresIn;

    try {
      const res = await fetch("/api/admin/service-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tokenName.trim(),
          description: tokenDesc.trim() || undefined,
          expiresIn: payloadExpiry,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Show one-time copy modal
        setNewlyCreatedToken({
          token: data.token,
          name: data.tokenRecord.name,
          expiresAt: data.tokenRecord.expiresAt,
        });
        setIsCopied(false);
        setIsCurlCopied(false);

        // Reset form
        setTokenName("");
        setTokenDesc("");
        setExpiresIn("30d");
        setCustomDate("");

        // Refresh list
        fetchTokens();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to generate service token",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error generating token" });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy helper
  const handleCopyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopyCurl = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCurlCopied(true);
    setTimeout(() => setIsCurlCopied(false), 2500);
  };

  // Toggle active/inactive
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/service-tokens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchTokens();
      } else {
        const err = await res.json().catch(() => ({}));
        if (res.status === 404) {
          fetchTokens();
          setMessage({
            type: "error",
            text: "This token was already deleted from the database. Refreshing list...",
          });
        } else {
          setMessage({ type: "error", text: err.error || "Failed to update token" });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Error updating token status" });
    }
  };

  // Delete/Revoke token
  const handleDeleteToken = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently revoke service token "${name}"? Any external services using this token will stop working immediately.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/service-tokens/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Service token "${name}" was permanently revoked.`,
        });
        fetchTokens();
      } else {
        const err = await res.json().catch(() => ({}));
        if (res.status === 404) {
          fetchTokens();
          setMessage({
            type: "error",
            text: "This token was already removed from the database. Refreshing list...",
          });
        } else {
          setMessage({ type: "error", text: err.error || "Failed to delete token" });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Error deleting token" });
    }
  };

  // Quick live test in modal for newly created token
  const handleTestLiveToken = async (rawToken: string) => {
    setTestingTokenId("modal");
    setTestResult(null);
    try {
      const res = await fetch(`/api/service/verify?token=${encodeURIComponent(rawToken)}`, {
        headers: {
          Authorization: `Bearer ${rawToken}`,
        },
      });
      const data = await res.json();
      setTestResult({
        success: res.ok,
        data: res.ok ? data : undefined,
        error: !res.ok ? (data.error || "Verification failed") : undefined,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || "Failed to connect to verification endpoint",
      });
    } finally {
      setTestingTokenId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Messages */}
      {message && (
        <Alert
          variant={message.type === "error" ? "destructive" : "default"}
          className={
            message.type === "success"
              ? "border-emerald-500/50 text-emerald-900 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20"
              : ""
          }
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* ── Token Generator Card ─────────────────────────────── */}
      <Card className="border-emerald-500/20 dark:border-emerald-500/20 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Generate Service Token</CardTitle>
                <CardDescription>
                  Create an API token with expiration for background jobs, scripts, or external services
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5"
            >
              Machine-to-Machine Auth
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateToken} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Token Name */}
              <div className="space-y-2">
                <Label htmlFor="tokenName" className="font-semibold">
                  Service / Token Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tokenName"
                  placeholder="e.g. Google Search Indexer, Zapier Sync, Backup Bot"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  disabled={isGenerating}
                  required
                />
              </div>

              {/* Expiration Time */}
              <div className="space-y-2">
                <Label htmlFor="expiresIn" className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  Expiration Time
                </Label>
                <Select
                  value={expiresIn}
                  onValueChange={setExpiresIn}
                  disabled={isGenerating}
                >
                  <SelectTrigger id="expiresIn">
                    <SelectValue placeholder="Select expiry duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days (Short-lived)</SelectItem>
                    <SelectItem value="30d">30 Days (Recommended)</SelectItem>
                    <SelectItem value="90d">90 Days (Quarterly)</SelectItem>
                    <SelectItem value="1y">1 Year (Long-lived)</SelectItem>
                    <SelectItem value="never">Never (Permanent / No Expiration)</SelectItem>
                    <SelectItem value="custom">Custom Date...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Expiration Date Picker if custom is selected */}
            {expiresIn === "custom" && (
              <div className="space-y-2 p-3 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
                <Label htmlFor="customDate" className="text-xs font-semibold">
                  Choose Expiration Date
                </Label>
                <Input
                  id="customDate"
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="tokenDesc" className="text-muted-foreground text-xs">
                Description &amp; Purpose (Optional)
              </Label>
              <Input
                id="tokenDesc"
                placeholder="e.g. Used for daily automated content publishing via CLI"
                value={tokenDesc}
                onChange={(e) => setTokenDesc(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isGenerating || !tokenName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Token...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Service Token
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Active Service Tokens Table ──────────────────────── */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Active Service Tokens ({tokens.length})
            </CardTitle>
            <CardDescription>
              Manage, monitor, and revoke tokens granted API access to SupplementDecoded
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTokens}
            disabled={isLoading}
            className="h-8 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && tokens.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
              Loading service tokens...
            </div>
          ) : tokens.length === 0 ? (
            <div className="py-12 text-center border border-dashed rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
              <Key className="w-10 h-10 mx-auto mb-3 text-stone-400" />
              <h4 className="font-semibold text-base mb-1">No Service Tokens Generated Yet</h4>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                Generate your first service token above to allow scripts, bots, or external APIs to connect securely.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service / Token Name</TableHead>
                    <TableHead>Token Identifier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id} className="hover:bg-muted/40 transition-colors">
                      {/* Name & Desc */}
                      <TableCell>
                        <div className="font-medium text-foreground">{token.name}</div>
                        {token.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                            {token.description}
                          </div>
                        )}
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Created {format(new Date(token.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>

                      {/* Hint */}
                      <TableCell>
                        <code className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                          {token.tokenHint}
                        </code>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {!token.isActive ? (
                          <Badge variant="outline" className="text-stone-500 border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900">
                            Deactivated
                          </Badge>
                        ) : token.isExpired ? (
                          <Badge variant="destructive" className="bg-rose-500 text-white">
                            Expired
                          </Badge>
                        ) : token.daysUntilExpiration !== null && token.daysUntilExpiration <= 5 ? (
                          <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30">
                            Expiring Soon ({token.daysUntilExpiration}d)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30">
                            Active
                          </Badge>
                        )}
                      </TableCell>

                      {/* Expiration Date */}
                      <TableCell>
                        {token.expiresAt ? (
                          <div className="text-xs">
                            <div className="font-medium">
                              {format(new Date(token.expiresAt), "MMM d, yyyy")}
                            </div>
                            <div className="text-muted-foreground text-[11px]">
                              {token.isExpired
                                ? `Expired ${formatDistanceToNow(new Date(token.expiresAt))} ago`
                                : `In ${formatDistanceToNow(new Date(token.expiresAt))}`}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Never expires
                          </span>
                        )}
                      </TableCell>

                      {/* Last Used */}
                      <TableCell>
                        {token.lastUsedAt ? (
                          <span className="text-xs text-foreground font-medium">
                            {formatDistanceToNow(new Date(token.lastUsedAt))} ago
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Never used
                          </span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Active */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-stone-500 hover:text-foreground"
                            title={token.isActive ? "Deactivate token" : "Activate token"}
                            onClick={() => handleToggleActive(token.id, token.isActive)}
                          >
                            <Power className={`h-4 w-4 ${token.isActive ? "text-emerald-600" : "text-stone-400"}`} />
                          </Button>

                          {/* Revoke / Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Revoke & Delete token"
                            onClick={() => handleDeleteToken(token.id, token.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Integration Guide & Usage Documentation ───────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            How to Use Service Tokens in API Requests
          </CardTitle>
          <CardDescription>
            Pass your generated token in HTTP headers to authenticate automated services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="curl" className="gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                cURL
              </TabsTrigger>
              <TabsTrigger value="js" className="gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                JavaScript / Node.js
              </TabsTrigger>
              <TabsTrigger value="python" className="gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Python
              </TabsTrigger>
            </TabsList>

            {/* cURL */}
            <TabsContent value="curl">
              <div className="relative rounded-lg bg-stone-900 text-stone-100 p-4 font-mono text-xs overflow-x-auto">
                <pre>{`# 1. Test token validity & capabilities
curl -X GET "https://www.supplementdecoded.com/api/service/verify" \\
  -H "Authorization: Bearer YOUR_SERVICE_TOKEN"

# 2. Automated stats extraction
curl -X GET "https://www.supplementdecoded.com/api/admin/dashboard" \\
  -H "Authorization: Bearer YOUR_SERVICE_TOKEN"

# 3. Publish an article via API
curl -X POST "https://www.supplementdecoded.com/api/blog/posts" \\
  -H "Authorization: Bearer YOUR_SERVICE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"New Monograph","slug":"new-monograph","content":"Article body..."}'`}</pre>
              </div>
            </TabsContent>

            {/* JavaScript */}
            <TabsContent value="js">
              <div className="relative rounded-lg bg-stone-900 text-stone-100 p-4 font-mono text-xs overflow-x-auto">
                <pre>{`// Fetch verified data with service token
const response = await fetch("https://www.supplementdecoded.com/api/service/verify", {
  method: "GET",
  headers: {
    "Authorization": \`Bearer \${process.env.SUPPLEMENT_SERVICE_TOKEN}\`,
    "Content-Type": "application/json",
  },
});

const data = await response.json();
console.log("Token authenticated:", data.valid);`}</pre>
              </div>
            </TabsContent>

            {/* Python */}
            <TabsContent value="python">
              <div className="relative rounded-lg bg-stone-900 text-stone-100 p-4 font-mono text-xs overflow-x-auto">
                <pre>{`import os
import requests

service_token = os.getenv("SUPPLEMENT_SERVICE_TOKEN")
headers = {
    "Authorization": f"Bearer {service_token}",
    "Content-Type": "application/json"
}

response = requests.get("https://www.supplementdecoded.com/api/service/verify", headers=headers)
print(response.json())`}</pre>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              Supported Headers: <code className="font-mono text-foreground font-semibold">Authorization: Bearer &lt;token&gt;</code> or <code className="font-mono text-foreground font-semibold">X-Service-Token: &lt;token&gt;</code>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Auto-timestamps last used date
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── One-Time Token Copy Modal ────────────────────────── */}
      <Dialog
        open={!!newlyCreatedToken}
        onOpenChange={(open) => {
          if (!open) {
            setNewlyCreatedToken(null);
            setTestResult(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <Key className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl">
              Service Token Generated Successfully
            </DialogTitle>
            <DialogDescription>
              Copy this token now. For security reasons, you will{" "}
              <strong className="text-foreground">never be able to view it again</strong> once you close this window.
            </DialogDescription>
          </DialogHeader>

          {newlyCreatedToken && (
            <div className="space-y-4 py-2">
              {/* Token Display & One-Click Copy */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Your Service Token ({newlyCreatedToken.name})
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={newlyCreatedToken.token}
                    className="font-mono text-xs bg-stone-100 dark:bg-stone-900 select-all border-emerald-500/50"
                  />
                  <Button
                    type="button"
                    onClick={() => handleCopyToken(newlyCreatedToken.token)}
                    className={
                      isCopied
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white min-w-[110px]"
                        : "min-w-[110px]"
                    }
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy Token
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Expiry detail */}
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {newlyCreatedToken.expiresAt ? (
                  <span>
                    Expires on:{" "}
                    <strong className="text-foreground">
                      {format(new Date(newlyCreatedToken.expiresAt), "PPPP")}
                    </strong>
                  </span>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    This token has no expiration date (Permanent).
                  </span>
                )}
              </div>

              {/* Quick cURL command with copy */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    Quick Test Command
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      const origin =
                        typeof window !== "undefined"
                          ? window.location.origin
                          : "https://www.supplementdecoded.com";
                      handleCopyCurl(
                        `curl -H "Authorization: Bearer ${newlyCreatedToken.token}" ${origin}/api/service/verify`,
                      );
                    }}
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    {isCurlCopied ? (
                      <>
                        <Check className="w-3 h-3" /> Copied Command
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Command
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-900 text-stone-100 font-mono text-[11px] overflow-x-auto">
                  <code>{`curl -H "Authorization: Bearer ${newlyCreatedToken.token}" ${typeof window !== "undefined" ? window.location.origin : "https://www.supplementdecoded.com"}/api/service/verify`}</code>
                </div>
              </div>

              {/* Live Test Inside Modal */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={testingTokenId === "modal"}
                  onClick={() => handleTestLiveToken(newlyCreatedToken.token)}
                  className="w-full text-xs gap-1.5 border-dashed"
                >
                  <Activity
                    className={`w-3.5 h-3.5 text-emerald-600 ${
                      testingTokenId === "modal" ? "animate-spin" : ""
                    }`}
                  />
                  {testingTokenId === "modal"
                    ? "Pinging Verification Endpoint..."
                    : "Live Ping Verification Endpoint"}
                </Button>

                {testResult && (
                  <div className="mt-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border text-xs">
                    {testResult.success ? (
                      <div className="space-y-1 text-emerald-700 dark:text-emerald-400">
                        <div className="flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          Verification OK: Token is valid and ready for API requests!
                        </div>
                        {testResult.data?.serviceToken && (
                          <div className="text-[11px] text-muted-foreground pl-6">
                            Status: Active • Expiration:{" "}
                            {testResult.data.serviceToken.expiresStatus}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600 font-medium">
                        <XCircle className="w-4 h-4 shrink-0" />
                        Verification Failed: {testResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between pt-2">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5 text-amber-500" />
              Do not share this token in public Git repositories.
            </p>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                setNewlyCreatedToken(null);
                setTestResult(null);
              }}
            >
              Done &amp; Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
