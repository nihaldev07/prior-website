/**
 * Renders schema.org JSON-LD. Server-safe (no deps).
 * The `<` escape prevents `</script>` breakout from content strings.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
