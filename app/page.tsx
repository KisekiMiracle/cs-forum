import { auth } from "@/auth";
import { headers } from "next/headers";
import { CardNews } from "./components/cards/news";
import { retrieveLatestNews } from "./actions/news";
import { News } from "./db/schema";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // @ts-ignore
  const { news }: { news: News[] } = await retrieveLatestNews();

  // TODO: Manage when there are no news

  return (
    <section className="flex flex-col gap-4">
      <article className="w-full flex items-center gap-8">
        {news.map((entry) => (
          <CardNews
            key={entry.title + ` ` + entry.description}
            title={entry.title}
            description={entry.description}
            coverUrl={entry.coverUrl as string}
          />
        ))}
      </article>
    </section>
  );
}
