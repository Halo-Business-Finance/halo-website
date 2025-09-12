import defaultHeaderBg from "@/assets/default-header-bg.jpg";

interface DefaultPageHeaderProps {
  title?: string;
  subtitle?: string;
}

const DefaultPageHeader = ({ title, subtitle }: DefaultPageHeaderProps) => {
  return (
    <section 
      className="relative py-16 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${defaultHeaderBg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          {title && (
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DefaultPageHeader;