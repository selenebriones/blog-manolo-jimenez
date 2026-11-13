import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_footer_social_links_platform" ADD VALUE 'tiktok';
  ALTER TABLE "home_page" ALTER COLUMN "facebook_title" SET DEFAULT 'Síguenos en redes sociales';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_social_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum_footer_social_links_platform";
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('facebook', 'x', 'instagram', 'youtube');
  ALTER TABLE "footer_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_footer_social_links_platform" USING "platform"::"public"."enum_footer_social_links_platform";
  ALTER TABLE "home_page" ALTER COLUMN "facebook_title" SET DEFAULT 'Síguenos en Facebook';`)
}
