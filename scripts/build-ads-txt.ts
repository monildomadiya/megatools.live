import { mkdir, writeFile } from "node:fs/promises";
async function main() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (client && !/^ca-pub-\d{16}$/.test(client)) throw new Error("NEXT_PUBLIC_ADSENSE_CLIENT must be ca-pub- followed by 16 digits.");
  await mkdir("public", { recursive: true });
  await writeFile("public/ads.txt", client ? `google.com, ${client.slice(3)}, DIRECT, f08c47fec0942fa0\n` : "# AdSense is not configured.\n");
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
