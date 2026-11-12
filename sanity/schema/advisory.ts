export const advisorySchema = {
  name: "advisory",
  title: "Security Advisory / Spotlight",
  type: "document",
  fields: [
    {
      name: "cveId",
      title: "CVE Identifier (e.g. CVE-2024-38077)",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "title",
      title: "Advisory Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "severity",
      title: "Severity",
      type: "string",
      options: {
        list: ["Critical", "High", "Medium", "Low"],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "cvssScore",
      title: "CVSS Score (0.0 - 10.0)",
      type: "number",
      validation: (Rule: any) => Rule.min(0).max(10),
    },
    {
      name: "affectedSystems",
      title: "Affected Systems",
      type: "string",
    },
    {
      name: "publishedDate",
      title: "Published Date",
      type: "date",
    },
    {
      name: "summary",
      title: "Impact Summary",
      type: "text",
    },
    {
      name: "verifiedMitigation",
      title: "Verified Mitigation / Patch",
      type: "text",
    },
    {
      name: "sourceUrl",
      title: "Official Advisory Source URL",
      type: "url",
    },
    {
      name: "exploitStatus",
      title: "Exploit Status",
      type: "string",
      options: {
        list: [
          "Confirmed Active Exploitation",
          "Proof of Concept Public",
          "Reported / Patch Available",
        ],
      },
    },
  ],
};

