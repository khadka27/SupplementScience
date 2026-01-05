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
import {
  Loader2,
  FileText,
  Eye,
  Users,
  Mail,
  Folder,
  Tags,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalCategories: number;
    totalTags: number;
    totalAuthors: number;
    totalSubscribers: number;
  };
  recentPosts: any[];
  popularPosts: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.stats || {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalAuthors: 0,
    totalSubscribers: 0,
  };

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      href: "/admin/blogs",
    },
    {
      title: "Published",
      value: stats.publishedPosts,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      href: "/admin/blogs?status=published",
    },
    {
      title: "Drafts",
      value: stats.draftPosts,
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      href: "/admin/blogs?status=draft",
    },
    {
      title: "Subscribers",
      value: stats.totalSubscribers,
      icon: Mail,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      href: "/admin/subscribers",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Folder,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      href: "/admin/categories",
    },
    {
      title: "Tags",
      value: stats.totalTags,
      icon: Tags,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950",
      href: "/admin/tags",
    },
    {
      title: "Authors",
      value: stats.totalAuthors,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      href: "/admin/authors",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Popular Posts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Popular Posts
              </CardTitle>
              <CardDescription>Most viewed published articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.popularPosts && data.popularPosts.length > 0 ? (
                  data.popularPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex-1 space-y-1">
                        <Link
                          href={`/admin/blog/${post.slug}`}
                          className="font-medium hover:text-primary line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {post.author?.name} • {post.category?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {post.viewCount}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No published posts yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Posts
              </CardTitle>
              <CardDescription>Latest created articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentPosts && data.recentPosts.length > 0 ? (
                  data.recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex-1 space-y-1">
                        <Link
                          href={`/admin/blog/${post.slug}`}
                          className="font-medium hover:text-primary line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {post.author?.name} • {post.category?.name}
                        </p>
                      </div>
                      <Badge
                        variant={
                          post.status === "PUBLISHED" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No posts yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Link href="/admin/blog/new">
                <Button className="w-full" size="lg">
                  <FileText className="h-4 w-4 mr-2" />
                  New Blog Post
                </Button>
              </Link>
              <Link href="/admin/blogs">
                <Button variant="outline" className="w-full" size="lg">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Blogs
                </Button>
              </Link>
              <Link href="/admin/subscribers">
                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  View Subscribers
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full" size="lg">
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
