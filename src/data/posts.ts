export const posts = [
  {
    slug: "friday-desktop-ai-assistant-release",
    href: "/posts/friday-desktop-ai-assistant-release/",
    when: "2026",
    date: "Jul 27, 2026",
    isoDate: "2026-07-27",
    title: "Friday 1.0: a local-first desktop AI assistant",
    read: "4 min read",
    aside: "release",
    excerpt:
      "Friday is out in public beta: a desktop AI assistant that runs a real tool loop on your machine, keeps your keys and history local, and asks before it acts.",
    tags: ["AI", "Desktop", "Electron", "MCP", "Product Launch"],
  },
  {
    slug: "will-artificial-intelligence-replace-software-developers",
    href: "/posts/will-artificial-intelligence-replace-software-developers/",
    when: "2024",
    date: "Dec 13, 2024",
    isoDate: "2024-12-13",
    title: "Will Artificial Intelligence Replace Software Developers?",
    read: "3 min read",
    aside: "ai",
    excerpt:
      "Will AI replace software developers? A reflection on how standardization, software architecture, and AI tooling are reshaping demand for developers.",
    tags: [
      "AI",
      "Software Development",
      "Software Architecture",
      "Software Testing",
      "Artificial Intelligence",
    ],
  },
  {
    slug: "mediator-design-pattern-in-swift",
    href: "/posts/mediator-design-pattern-in-swift/",
    when: "2023",
    date: "Feb 28, 2023",
    isoDate: "2023-02-28",
    title: '"Mediator" design pattern in Swift',
    read: "2 min read",
    aside: "pattern",
    excerpt:
      "A Swift example of the Mediator design pattern, where buyers and sellers communicate through an agent instead of talking directly.",
    tags: ["Swift", "Xcode", "IOS", "Design Pattern Ios", "Swift Programming"],
  },
  {
    slug: "monostate-or-singleton-with-a-twist-design-pattern",
    href: "/posts/monostate-or-singleton-with-a-twist-design-pattern/",
    when: "2023",
    date: "Feb 26, 2023",
    isoDate: "2023-02-26",
    title: 'Monostate or "Singleton with a twist" design pattern',
    read: "1 min read",
    aside: "pattern",
    excerpt:
      "A short Swift example of the Monostate design pattern, where multiple instances share the same class-level state.",
    tags: ["IOS", "Xcode", "Playground", "IPhone", "Design Patterns"],
  },
  {
    slug: "strong-and-weak-references-in-swift",
    href: "/posts/strong-and-weak-references-in-swift/",
    when: "2023",
    date: "Feb 25, 2023",
    isoDate: "2023-02-25",
    title: "Strong and weak references in Swift",
    read: "2 min read",
    aside: "swift",
    excerpt:
      "A short walkthrough of strong and weak references in Swift, with examples that show how object deallocation changes when references are released.",
    tags: ["IOS", "Swift", "Xcode", "Design Patterns"],
  },
] as const;

export type Post = (typeof posts)[number];
