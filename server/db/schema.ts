// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
    index,
    pgTableCreator,
    text,
    timestamp,
    uuid,
  } from "drizzle-orm/pg-core";
  
  /**
   * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
   * database instance for multiple projects.
   *
   * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
   */
  export const createTable = pgTableCreator((name) => `monopoly_banking_app_${name}`);
  
  // export const articles = createTable(
  //   "article",
  //   () => ({
  //     id: uuid("id").defaultRandom().primaryKey(),
  //     userId: text("user_id").notNull(),
  //     url: text("url").notNull(),
  //     imageUrl: text("image_url"),
  //     title: text("title").notNull(),
  //     description: text("description"),
  //     tags: text("tags"),
  //     createdAt: timestamp("created_at").defaultNow().notNull(),
  //     updatedAt: timestamp("updated_at").defaultNow().notNull(),
  //   }),
  //   (t) => [index("title_idx").on(t.title)],
  // );