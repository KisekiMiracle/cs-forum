import { getNewestThreads } from "@/app/actions/thread";
import { Thread } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function CardNewThreads() {
  // @ts-ignore
  const { threads }: { threads: Thread[] } = await getNewestThreads();

  // TODO: Manage when there are no threads

  return (
    <Card size="default" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-bold text-lg">New Threads</CardTitle>
        <CardDescription>
          Discover what new topics have arisen recently.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* @ts-ignore */}
        {threads.map(({ thread, user }) => (
          <Card
            size="sm"
            className="mx-auto w-full max-w-sm"
            key={thread.title + thread.id}
          >
            <CardHeader>
              <CardTitle className="font-bold">
                <Link href={`/thread/${thread.id}`}>{thread.title}</Link>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {thread.content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-1">
                Created by
                <Link
                  href={`/profile/${thread.authorId}`}
                  className="text-blue-600 underline hover:no-underline transition-all duration-150 hover:text-blue-500"
                >
                  {user?.name}
                </Link>
              </p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
