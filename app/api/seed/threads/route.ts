import { NextRequest, NextResponse } from "next/server";
import { faker } from "@faker-js/faker";
import { db } from "@/app/db/drizzle"; // 🟢 Adjust this path to your Drizzle db instance
import { thread, user } from "@/app/db/schema"; // 🟢 Adjust to your schema location

function generateRandomMarkdown(): string {
  return `
# ${faker.lorem.sentence()}

${faker.lorem.paragraph()}

## ${faker.lorem.words(3)}

* ${faker.lorem.sentence()}
* ${faker.lorem.sentence()}
* ${faker.lorem.sentence()}

### System Code Block
\`\`\`ts
// ${faker.lorem.sentence()}
const ${faker.lorem.word()} = "${faker.lorem.word()}";
console.log(${faker.lorem.word()});
\`\`\`

> ${faker.lorem.sentences(2)}

This is a **${faker.lorem.word()}** statement with an embedded link: [Click here to read more](${faker.internet.url()}).

${faker.lorem.paragraphs(2, "\n\n")}
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    // 1. Fetch existing users so your threads have valid foreign keys
    const existingUsers = await db.select({ id: user.id }).from(user);

    if (existingUsers.length === 0) {
      return NextResponse.json(
        {
          error:
            "No users found in database. Seed users first before seeding threads.",
        },
        { status: 400 },
      );
    }

    // 2. Parse how many threads to generate from the request body (default to 20)
    const body = await request.json().catch(() => ({}));
    const count = typeof body.count === "number" ? body.count : 20;

    // Available categories extracted right from your pgEnum definition
    const categories = [
      "CRESCENT_SUN",
      "ARTWORKS",
      "PROJECTS",
      "RESOURCES",
      "CLASSIFIEDS",
      "GENERAL",
    ] as const;

    const dummyThreads: (typeof thread.$inferInsert)[] = [];

    // 3. Generate randomized dummy data records
    for (let i = 0; i < count; i++) {
      // Pick a random user from your database
      const randomUser = faker.helpers.arrayElement(existingUsers);

      // Select a random category
      const randomCategory = faker.helpers.arrayElement(categories);

      // Generate a variable number of community tags (e.g., ["gaming", "update"])
      const totalTags = faker.number.int({ min: 1, max: 4 });
      const randomTags = Array.from({ length: totalTags }, () =>
        faker.lorem.word().toLowerCase(),
      );

      dummyThreads.push({
        authorId: randomUser.id,
        title: faker.lorem.sentence({ min: 4, max: 10 }),
        category: randomCategory,
        // Generates markdown/paragraphs for deep forum card content testing
        content: generateRandomMarkdown(),
        tags: randomTags,
        canBeEdited: faker.datatype.boolean({ probability: 0.9 }), // 90% chance true
        canBeReplied: faker.datatype.boolean({ probability: 0.95 }),
        // Spread a distribution of creation timelines across the last 30 days
        createdAt: faker.date.recent({ days: 30 }),
      });
    }

    // 4. Fire a bulk insert batch query down to PostgreSQL
    const insertedRows = await db
      .insert(thread)
      .values(dummyThreads)
      .returning();

    return NextResponse.json(
      {
        message: `Successfully seeded ${insertedRows.length} threads!`,
        threadsInserted: insertedRows.length,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Thread seeding failed:", error);
    return NextResponse.json(
      { error: "Seeding internal error", details: error.message },
      { status: 500 },
    );
  }
}
