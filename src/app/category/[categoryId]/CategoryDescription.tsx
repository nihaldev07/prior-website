// Below-grid SEO content section. The rich TipTap description is rendered
// into the raw HTML (via the hybrid RichText) instead of living behind the
// old info-button Sheet — this is the indexable long-form content.
// The GEO answer-first sentence and the short description live here too,
// alongside the description (they used to sit under the banner).
import RichText from "@/components/seo/RichText";
import CategoryDescriptionClamp from "./CategoryDescriptionClamp";

interface CategoryDescriptionProps {
  name: string;
  description: string;
  shortDescription?: string;
  geoSentence?: string;
}

// Editorial long-form styling scoped to the rich text container.
// (Note: screen variants wrap the arbitrary variant, e.g. md:[&_h2]:… —
// the reverse order does not compile.)
const richTextTypography =
  "[&_h1]:text-2xl [&_h1]:font-serif [&_h1]:tracking-wide [&_h1]:text-neutral-900 " +
  "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-serif [&_h2]:tracking-wide [&_h2]:text-neutral-900 " +
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-serif [&_h3]:tracking-wide [&_h3]:text-neutral-900 " +
  "[&_p]:text-sm md:[&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-neutral-600 " +
  "[&_ul]:space-y-1.5 [&_ol]:space-y-1.5 [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-neutral-600 " +
  "[&_a]:text-neutral-900 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-neutral-300 hover:[&_a]:decoration-neutral-900 " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-500";

export default function CategoryDescription({
  name,
  description,
  shortDescription,
  geoSentence,
}: CategoryDescriptionProps) {
  if (!description && !shortDescription && !geoSentence) return null;

  return (
    <section className='px-4 md:container my-10 md:my-16 pt-8 md:pt-12 border-t border-neutral-200'>
      {/* Rule-flanked section label */}
      <div className='flex items-center gap-3 md:gap-4'>
        <span className='h-px flex-1 bg-neutral-200' aria-hidden='true' />
        <p className='text-[11px] md:text-xs font-serif tracking-[0.25em] uppercase text-neutral-500 whitespace-nowrap'>
          About this collection
        </p>
        <span className='h-px flex-1 bg-neutral-200' aria-hidden='true' />
      </div>
      <h2 className='mt-4 text-xl sm:text-2xl md:text-3xl font-serif tracking-wide text-neutral-900 text-center'>
        {name} at Prior
      </h2>

      <div className='mt-6 md:mt-8 max-w-3xl mx-auto'>
        {/* Short description — the lead */}
        {shortDescription && (
          <p className='text-sm md:text-[15px] leading-relaxed text-neutral-500'>
            {shortDescription}
          </p>
        )}

        {/* GEO answer-first sentence */}
        {geoSentence && (
          <p
            className={`text-sm font-serif leading-relaxed text-neutral-600 ${shortDescription ? "mt-3" : ""}`}>
            {geoSentence}
          </p>
        )}

        {/* Rich description */}
        {description && (
          <>
            {(shortDescription || geoSentence) && (
              <div className='mt-6 md:mt-8 h-px w-16 bg-neutral-200' aria-hidden='true' />
            )}
            <div className={shortDescription || geoSentence ? "mt-6 md:mt-8" : ""}>
              <CategoryDescriptionClamp>
                <RichText html={description} className={richTextTypography} />
              </CategoryDescriptionClamp>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
