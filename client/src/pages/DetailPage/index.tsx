import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageGallery from '../../components/detail/ImageGallery';
import PropertyInfoRow from '../../components/detail/PropertyInfoRow';
import PropertyStatGrid from '../../components/detail/PropertyStatGrid';
import AboutSection from '../../components/detail/AboutSection';
import AmenitiesSection from '../../components/detail/AmenitiesSection';
import LocationSection from '../../components/detail/LocationSection';
import AgentCard from '../../components/detail/AgentCard';
import BottomActionBar from '../../components/detail/BottomActionBar';
import ContactModal from '../../components/detail/ContactModal';
import { usePropertyDetail } from '../../hooks/usePropertyDetail';

const MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDz2vDacJKsq6UUycICrPPvIFVxX4xk6z-_XgOX7isJosxpbfVTpbGsnnRyvDqZU-Bf9cksD7buYC_RDY0u5-BhruKKy4RKJ_04VL6EXpJhO_-k2Dow00Ov5_AcARLGn_l1Lc4WS1EgkJq9PpzoPGYfOpuaSruuYozuQvY3I_wmUjWLeErLe5QSAlkxo4nY-iKeGQd6X8XwoWhZNZ1oYHwMFnfqoVpyAHUBOo9R90DAIAW3aiBpKSAs3hud9OnzmJLSidbKqZ0PttY';

type ModalMode = 'contact' | 'inquiry';

const DetailPage = () => {
  const navigate               = useNavigate();
  const { id }                 = useParams();
  const { property, loading }  = usePropertyDetail(id);
  const [favd, setFavd]        = useState(false);
  const [modal, setModal]      = useState<ModalMode | null>(null);

  if (loading || !property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface-bright">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
      </div>
    );
  }

  const stats = [
    { icon: 'bed',        value: property.meta[0]?.value ?? '—', label: 'Bedrooms' },
    { icon: 'straighten', value: property.area ?? '—',           label: 'Sq. Ft.' },
    { icon: 'explore',    value: property.facing ?? '—',         label: 'Facing' },
  ];

  const handleCall = () => window.open(`tel:${property.agent?.phone ?? ''}`);

  return (
    <div className="bg-surface font-body-md text-on-surface">

      {/* ── Breadcrumb bar ── */}
      <div className="border-b border-outline-variant bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="text-body-sm font-semibold hidden sm:inline">Back to Listings</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setFavd((p) => !p)}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={favd ? { fontVariationSettings: "'FILL' 1", color: '#a700ad' } : {}}
              >
                favorite
              </span>
              <span className="text-body-sm hidden sm:inline">Save</span>
            </button>
            <button
              onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">share</span>
              <span className="text-body-sm hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Image gallery ── */}
      <ImageGallery
        images={property.images ?? [property.image]}
        isVerified={property.isVerified}
      />

      {/* ── Two-column content ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-8 pb-28 lg:pb-12">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 lg:items-start">

          {/* ── Left column ── */}
          <div>
            <PropertyInfoRow
              title={property.title}
              location={property.location}
              price={property.price}
              pricePerSqft={property.pricePerSqft}
              hidePriceOnDesktop
            />

            <PropertyStatGrid stats={stats} />

            {property.description && (
              <AboutSection description={property.description} />
            )}

            {property.amenities && property.amenities.length > 0 && (
              <AmenitiesSection amenities={property.amenities} />
            )}

            {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
              <LocationSection mapImage={MAP_IMAGE} nearbyPlaces={property.nearbyPlaces} />
            )}

            {property.agent && (
              <div className="lg:hidden mt-2">
                <AgentCard agent={property.agent} onCall={handleCall} />
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] space-y-4">

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <p className="text-[28px] font-bold text-primary leading-tight">{property.price}</p>
                {property.pricePerSqft && (
                  <p className="text-body-sm text-on-surface-variant mt-0.5">{property.pricePerSqft}</p>
                )}
                {property.emi && (
                  <p className="text-body-sm text-on-surface-variant mt-0.5">EMI: {property.emi}</p>
                )}

                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => setModal('contact')}
                    className="w-full h-12 rounded-xl bg-primary text-on-primary font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      person
                    </span>
                    Contact Agent
                  </button>
                  <button
                    onClick={() => setModal('inquiry')}
                    className="w-full h-12 rounded-xl border-2 border-primary text-primary font-semibold flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    Send Inquiry
                  </button>
                </div>

                {property.status && (
                  <p className="mt-4 text-center text-body-sm text-on-surface-variant">
                    Listed for{' '}
                    <span className="font-semibold text-on-surface">{property.status}</span>
                  </p>
                )}
              </div>

              {property.agent && (
                <AgentCard agent={property.agent} onCall={handleCall} />
              )}
            </div>
          </aside>

        </div>
      </div>

      {/* Mobile bottom bar */}
      <BottomActionBar
        onInquiry={()      => setModal('inquiry')}
        onContactAgent={()  => setModal('contact')}
      />

      {/* Contact / Inquiry modal */}
      {modal && property.agent && (
        <ContactModal
          agent={property.agent}
          propertyId={property.id}
          propertyTitle={property.title}
          mode={modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default DetailPage;
