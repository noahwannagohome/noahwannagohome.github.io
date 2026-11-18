import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { rehypeTableWrapper } from "./src/utils/rehypeTableWrapper";
import {
  inlineTocDeprecation,
  rehypeInlineToc,
} from "./src/utils/rehypeInlineToc";

const base = "/tech-b-log";

async function replaceAsync(
  text: string,
  pattern: RegExp,
  replacer: (match: string, ...groups: string[]) => Promise<string>
) {
  const replacements = await Promise.all(
    [...text.matchAll(pattern)].map(([match, ...groups]) =>
      replacer(match, ...groups)
    )
  );
  let i = 0;
  return text.replace(pattern, () => replacements[i++]);
}

export default defineConfig({
  site: "https://noahwannagohome.github.io",
  base,
  trailingSlash: "always",
  integrations: [
    mdx(),
    sitemap({
      // Pages marked noindex (search, archives, tag lists) stay out of the
      // sitemap so crawlers spend their budget on posts.
      filter: page =>
        !/\/(search|archives|tags)(\/|$)/.test(new URL(page).pathname),
    }),
    {
      name: "single-sitemap",
      hooks: {
        "astro:build:done": async ({ dir, logger }) => {
          const files = (await readdir(dir)).filter(file =>
            /^sitemap.*\.xml$/.test(file)
          );
          // Fail rather than silently discard URLs if the sitemap ever splits.
          if (
            files.length !== 2 ||
            !files.includes("sitemap-0.xml") ||
            !files.includes("sitemap-index.xml")
          ) {
            throw new Error("Expected one generated sitemap and its index.");
          }
          // Add <lastmod> to post URLs from the article dates in their HTML.
          const xml = await readFile(new URL("sitemap-0.xml", dir), "utf8");
          const withLastmod = await replaceAsync(
            xml,
            /<loc>([^<]+)<\/loc>/g,
            async (match, loc) => {
              const path = new URL(loc).pathname.slice(`${base}/`.length);
              if (!path.startsWith("posts/") || path === "posts/") return match;
              const html = await readFile(
                new URL(`${path}index.html`, dir),
                "utf8"
              ).catch(() => "");
              const date =
                html.match(
                  /property="article:modified_time" content="([^"]+)"/
                )?.[1] ??
                html.match(
                  /property="article:published_time" content="([^"]+)"/
                )?.[1];
              return date ? `${match}<lastmod>${date}</lastmod>` : match;
            }
          );
          await writeFile(new URL("sitemap.xml", dir), withLastmod);
          await rm(new URL("sitemap-0.xml", dir));
          await rm(new URL("sitemap-index.xml", dir));
          logger.info("Created sitemap.xml");
        },
      },
    },
    inlineTocDeprecation(),
  ],
  i18n: {
    locales: ["ko"],
    defaultLocale: "ko",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    // Deprecated: the theme no longer uses remark-toc or remark-collapse. They
    // stay in package.json so a customised config importing them still builds,
    // and are removed in v8.
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        rehypeInlineToc,
        rehypeCallouts,
        rehypeTableWrapper,
      ],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
