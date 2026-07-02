/** Rich text (HTML) эсвэл энгийн текстийг зөв харуулна. */
export function RichBody({ html, className = "" }: { html: string; className?: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(html);
  if (isHtml) return <div className={"rich-body " + className} dangerouslySetInnerHTML={{ __html: html }} />;
  return <div className={"whitespace-pre-line " + className}>{html}</div>;
}
