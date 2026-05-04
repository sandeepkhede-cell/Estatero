interface BentoCardProps {
  image: string;
  title: string;
  description?: string;
  badge?: string;
  large?: boolean;
  onClick?: () => void;
}

const BentoCard = ({ image, title, description, badge, large = false, onClick }: BentoCardProps) => (
  <div
    onClick={onClick}
    className={`relative rounded-xl overflow-hidden group shadow-lg cursor-pointer ${
      large ? 'md:col-span-2 md:row-span-2' : 'shadow-md min-h-[200px]'
    }`}
  >
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    <div
      className={`absolute inset-0 flex flex-col justify-end ${
        large ? 'bg-gradient-to-t from-black/80 to-transparent p-lg' : 'bg-gradient-to-t from-black/70 to-transparent p-md'
      }`}
    >
      {badge && (
        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold w-fit mb-2">
          {badge}
        </span>
      )}
      <h3 className={`text-white mb-1 ${large ? 'font-h3 text-h3' : 'font-label-bold text-lg'}`}>
        {title}
      </h3>
      {description && (
        <p className={`${large ? 'text-gray-300 text-body-sm' : 'text-gray-200 text-[12px]'}`}>
          {description}
        </p>
      )}
    </div>
  </div>
);

export default BentoCard;
