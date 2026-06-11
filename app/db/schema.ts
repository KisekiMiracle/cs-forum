import { relations, sql } from "drizzle-orm";
import {
  uuid,
  text,
  boolean,
  pgTable,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["USER", "MOD", "ADMIN"]);
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
export type User = typeof user.$inferSelect;

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const profile = pgTable("profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  avatarUrl: text("avatar_url"),
  displayName: text("display_name").notNull(),
  bio: text("bio"),

  badges: uuid("badges")
    .array()
    .notNull()
    .default(sql`'{}'::uuid[]`),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
export type Profile = typeof profile.$inferSelect;

export const badge = pgTable("badge", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
});

export const news = pgTable("news", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),
  description: text("descripton").notNull(),

  slug: text("slug").notNull(),
  coverUrl: text("cover_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
export type News = typeof news.$inferSelect;

export const categoryEnum = pgEnum("thread_category", [
  "CRESCENT_SUN",
  "ARTWORKS",
  "PROJECTS",
  "RESOURCES",
  "CLASSIFIEDS",
  "GENERAL",
]);
export const thread = pgTable(
  "thread",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    category: categoryEnum("category").notNull(),
    content: text("content").notNull(),

    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    canBeEdited: boolean("can_be_edited").notNull().default(true),
    canBeReplied: boolean("can_be_replied").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    index("thread_author_idx").on(table.authorId),
    index("thread_category_idx").on(table.category),
  ],
);
export type Thread = typeof thread.$inferSelect;

export const comment = pgTable(
  "comment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => thread.id, { onDelete: "cascade" }),

    content: text("content").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    index("comment_author_idx").on(table.authorId),
    index("comment_thread_idx").on(table.threadId),
  ],
);
export type Comment = typeof comment.$inferSelect;

export const reactionTypeEnum = pgEnum("reaction_type", [
  "LIKE",
  "HEART",
  "LAUGH",
  "SWEETROLL",
]);

export const reaction = pgTable(
  "reaction",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    type: reactionTypeEnum("type").notNull(),

    threadId: uuid("thread_id").references(() => thread.id, {
      onDelete: "cascade",
    }),
    commentId: uuid("comment_id").references(() => comment.id, {
      onDelete: "cascade",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("reaction_thread_idx").on(table.threadId),
    index("reaction_comment_idx").on(table.commentId),
    // 🟢 Composite index guarantees a user can only give ONE reaction type per item
    index("user_reaction_unique_idx").on(
      table.userId,
      table.threadId,
      table.commentId,
    ),
  ],
);
export type Reaction = typeof reaction.$inferSelect;
