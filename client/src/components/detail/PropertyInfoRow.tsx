interface PropertyInfoRowProps {
  title: string;
  location: string;
  price: string;
  pricePerSqft?: string;
  hidePriceOnDesktop?: boolean;
}

const PropertyInfoRow = ({
  title,
  location,
  price,
  pricePerSqft,
  hidePriceOnDesktop = false,
}: PropertyInfoRowProps) => (
  <div className="flex justify-between items-start mb-4">
    <div className="flex-1 min-w-0 pr-4">
      <h1 className="font-h2 text-h2 text-on-surface mb-1">{title}</h1>
      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
        <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
        {location}
      </p>
    </div>
    <div className={`text-right flex-shrink-0 ${hidePriceOnDesktop ? 'lg:hidden' : ''}`}>
      <p className="font-price-display text-price-display text-primary">{price}</p>
      {pricePerSqft && (
        <p className="font-label-bold text-label-bold text-on-surface-variant mt-1">{pricePerSqft}</p>
      )}
    </div>
  </div>
);

export default PropertyInfoRow;
