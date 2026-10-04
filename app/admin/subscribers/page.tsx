"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  Users,
  RefreshCw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  updatedAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [subscribers, searchQuery, statusFilter]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/subscribers");
      if (!res.ok) {
        throw new Error("Failed to fetch subscribers");
      }
      const data = await res.json();
      setSubscribers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  const filterSubscribers = () => {
    let result = [...subscribers];

    if (statusFilter === "active") {
      result = result.filter((sub) => sub.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((sub) => !sub.isActive);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((sub) => sub.email.toLowerCase().includes(q));
    }

    setFilteredSubscribers(result);
  };

  const handleToggleStatus = async (subscriber: Subscriber) => {
    setTogglingId(subscriber.id);
    const newStatus = !subscriber.isActive;
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subscriber.id, isActive: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setSubscribers((prev) =>
        prev.map((s) => (s.id === subscriber.id ? { ...s, isActive: newStatus } : s))
      );
      toast.success(
        `Subscriber marked as ${newStatus ? "Active" : "Inactive"}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subscriber status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!subscriberToDelete) return;

    try {
      const res = await fetch(`/api/admin/subscribers?id=${subscriberToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete subscriber");
      }

      toast.success("Subscriber removed successfully");
      setDeleteDialogOpen(false);
      setSubscriberToDelete(null);
      setSubscribers((prev) => prev.filter((s) => s.id !== subscriberToDelete.id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subscriber");
    }
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      toast.info("No subscribers to export");
      return;
    }

    const headers = ["Email", "Status", "Subscribed Date", "Last Updated"];
    const rows = filteredSubscribers.map((sub) => [
      `"${sub.email}"`,
      sub.isActive ? "Active" : "Inactive",
      new Date(sub.subscribedAt).toISOString(),
      new Date(sub.updatedAt).toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredSubscribers.length} subscribers`);
  };

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const inactiveCount = subscribers.filter((s) => !s.isActive).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40">
                <Mail className="h-5 w-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Newsletter Audience
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track readers, verify opt-in statuses, and export mailing lists.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubscribers}
              disabled={loading}
              className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={exportToCSV}
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV ({filteredSubscribers.length})
            </Button>
          </div>
        </div>

        {/* Stats KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Subscribers
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {subscribers.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Readers
                </p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {activeCount}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <UserCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Unsubscribed / Inactive
                </p>
                <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {inactiveCount}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <UserX className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls Card */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by email address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses ({subscribers.length})</SelectItem>
                    <SelectItem value="active">Active Only ({activeCount})</SelectItem>
                    <SelectItem value="inactive">Inactive Only ({inactiveCount})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400 mb-2" />
              <p className="text-sm text-slate-500">Loading subscribers list...</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No subscribers found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {searchQuery || statusFilter !== "all"
                  ? "Try resetting your search or status filter to see other readers."
                  : "When readers opt into newsletters on your site, they will appear here automatically."}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/60 dark:bg-slate-800/40">
                  <TableRow className="border-b border-slate-200/80 dark:border-slate-800">
                    <TableHead className="w-[45%] font-semibold text-slate-700 dark:text-slate-300">
                      Subscriber Email
                    </TableHead>
                    <TableHead className="w-[20%] font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </TableHead>
                    <TableHead className="w-[20%] font-semibold text-slate-700 dark:text-slate-300">
                      Subscribed On
                    </TableHead>
                    <TableHead className="w-[15%] text-right font-semibold text-slate-700 dark:text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((sub) => (
                    <TableRow
                      key={sub.id}
                      className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-semibold">
                            {sub.email.charAt(0).toUpperCase()}
                          </span>
                          <span>{sub.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            sub.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                              : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700"
                          }
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              sub.isActive ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {sub.isActive ? "Active" : "Unsubscribed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                        {sub.subscribedAt
                          ? new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(sub)}
                            disabled={togglingId === sub.id}
                            title={
                              sub.isActive
                                ? "Deactivate / Unsubscribe"
                                : "Reactivate Subscriber"
                            }
                            className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                          >
                            {togglingId === sub.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : sub.isActive ? (
                              <XCircle className="h-3.5 w-3.5 text-amber-500 mr-1" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                            )}
                            {sub.isActive ? "Deactivate" : "Activate"}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSubscriberToDelete(sub);
                              setDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Delete Subscriber"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredSubscribers.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>
                Showing {filteredSubscribers.length} of {subscribers.length} total subscribers
              </span>
              <span>Sorted by newest opt-ins first</span>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete subscriber?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{" "}
              <strong className="text-slate-900 dark:text-white">
                {subscriberToDelete?.email}
              </strong>{" "}
              from the subscriber database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Delete Subscriber
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
