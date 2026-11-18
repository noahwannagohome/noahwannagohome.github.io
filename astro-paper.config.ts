import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://noahwannagohome.github.io/tech-b-log/",
    title: "Tech B.Log",
    googleVerification: "ZlkCIsaZdjVwtDmHO61QSUSd3YrHpXp631RmgsxoqLM",
    tagline: "백엔드·인프라·LLM 서빙 개발 블로그",
    description:
      "백엔드, 인프라, LLM 서빙(vLLM), 코딩 에이전트와 온프레미스 AI 도입을 직접 만들고 운영하며 겪은 문제와 해결 과정을 기록하는 김상훈의 개발 블로그.",
    // Fill these in from Naver Search Advisor / Bing Webmaster Tools when registering.
    naverVerification: "",
    bingVerification: "",
    author: "김상훈",
    profile: "https://github.com/noahwannagohome",
    ogImage: "tech-b-log-og.png",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: { perPage: 8, perIndex: 5 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: true, url: "https://github.com/noahwannagohome/tech-b-log/edit/main/" },
    search: "pagefind",
    toc: true,
  },
  socials: [{ name: "github", url: "https://github.com/noahwannagohome", linkTitle: "김상훈의 GitHub" }],
  shareLinks: [],
});
