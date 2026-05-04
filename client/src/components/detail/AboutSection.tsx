import { useState } from 'react';

interface AboutSectionProps {
  description: string;
}

const AboutSection = ({ description }: AboutSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-8">
      <h3 className="font-h3 text-h3 mb-3">About this property</h3>
      <p className={`font-body-md text-body-md text-on-surface-variant leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
        {description}
      </p>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-2 text-primary font-label-bold text-label-bold flex items-center gap-1"
      >
        {expanded ? 'SHOW LESS' : 'READ MORE'}
        <span className="material-symbols-outlined text-[14px]">
          {expanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>
    </div>
  );
};

export default AboutSection;
