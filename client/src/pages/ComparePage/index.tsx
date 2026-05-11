import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { Property } from '../../types/property';
import { formatINR } from '../../utils/formatINR';
import { useCompare } from '../../context/CompareContext';

function val(v: string | number | boolean | undefined | null): string {
  if (v === undefined || v === null || v === '') return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v);
}

const ROWS: { label: string; key: keyof Property }[] = [
  { label: 'Price',        key: 'price'           },
  { label: 'Location',     key: 'location'        },
  { label: 'City',         key: 'city'            },
  { label: 'Type',         key: 'listingType'     },
  { label: 'Property Type',key: 'propertyType'    },
  { label: 'Area',         key: 'area'            },
  { label: 'Floor',        key: 'floor'           },
  { label: 'Facing',       key: 'facing'          },
  { label: 'Furnishing',   key: 'furnishing'      },
  { label: 'Availability', key: 'availability'    },
  { label: 'Age',          key: 'ageOfProperty'   },
  { label: 'RERA',         key: 'isReraRegistered'},
  { label: 'RERA No.',     key: 'reraNumber'      },
  { label: 'EMI',          key: 'emi'             },
  { label: 'Status',       key: 'listingStatus'   },
];

const ComparePage = () => {
  const [searchParams]             = useSearchParams();
  const navigate                   = useNavigate();
  const { toggle, isSelected }     = useCompare();

  const ids = (searchParams.get('ids') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const [properties, setProperties] = useState<(Property | null)[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!ids.length) { setLoading(false); return; }
    Promise.all(
      ids.map((id) => propertyService.getById(id).catch(() => null))
    ).then((results) => {
      setProperties(results);
      setLoading(false);
    });
  }, [searchParams.get('ids')]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface-bright">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
      </div>
    );
  }

  const valid = properties.filter(Boolean) as Property[];

  if (!valid.length) {
    return (
      <div className="flex flex-col items-center py-24 gap-4 bg-surface-bright min-h-[60vh]">
        <span className="material-symbols-outlined text-outline text-7xl">compare</span>
        <h2 className="text-lg font-bold text-on-surface">No properties to compare</h2>
        <p className="text-sm text-on-surface-variant">Select up to 3 properties from listings to compare them.</p>
        <button
          onClick={() => navigate('/listings')}
          className="mt-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold"
        >
          Browse Properties
        </button>
      </div>
    );
  }

  const colWidth = valid.length === 2 ? 'w-[45%]' : 'w-[30%]';

  return (
    <main className="flex-grow bg-surface-bright pb-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary mb-1"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back
            </button>
            <h1 className="text-xl font-bold text-on-surface">Compare Properties</h1>
            <p className="text-sm text-on-surface-variant">Comparing {valid.length} properties side by side</p>
          </div>
          <button
            onClick={() => navigate('/listings')}
            className="text-sm font-semibold text-primary hover:underline hidden sm:block"
          >
            + Add more
          </button>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
          <table className="w-full border-collapse text-sm">

            {/* Property headers */}
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-[22%] px-5 py-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low">
                  Attribute
                </th>
                {valid.map((p) => (
                  <th key={p.id} className={`${colWidth} px-5 py-4 text-left align-top`}>
                    <div className="flex flex-col gap-2">
                      <div className="relative rounded-xl overflow-hidden h-32">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3">
                          <p className="text-white text-xs font-bold line-clamp-2 leading-tight">{p.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-base font-bold text-primary">{formatINR(p.price)}</p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggle(p)}
                            title={isSelected(p.id) ? 'Remove from compare' : 'Add to compare'}
                            className={[
                              'flex items-center gap-0.5 text-[10px] font-semibold px-2 py-1 rounded-full border transition-colors',
                              isSelected(p.id)
                                ? 'bg-primary/10 border-primary/30 text-primary'
                                : 'border-gray-200 text-on-surface-variant hover:border-primary hover:text-primary',
                            ].join(' ')}
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              {isSelected(p.id) ? 'check' : 'add'}
                            </span>
                            {isSelected(p.id) ? 'In list' : 'Add'}
                          </button>
                          <button
                            onClick={() => navigate(`/property/${p.id}`)}
                            className="flex items-center gap-0.5 text-[10px] font-semibold px-2 py-1 rounded-full border border-gray-200 text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Attribute rows */}
            <tbody>
              {ROWS.map(({ label, key }, rowIdx) => {
                const rowVals = valid.map((p) => {
                  if (key === 'price') return formatINR(p.price);
                  return val(p[key] as string | number | boolean | undefined | null);
                });
                const allSame = rowVals.every((v) => v === rowVals[0]);

                return (
                  <tr
                    key={key}
                    className={[
                      'border-b border-gray-50',
                      rowIdx % 2 === 0 ? '' : 'bg-gray-50/50',
                    ].join(' ')}
                  >
                    <td className="px-5 py-3.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap bg-surface-container-low border-r border-gray-100">
                      {label}
                    </td>
                    {rowVals.map((v, ci) => (
                      <td
                        key={ci}
                        className={[
                          'px-5 py-3.5 text-sm text-on-surface',
                          v === '—' ? 'text-on-surface-variant/60' : '',
                          !allSame && v !== '—' ? 'font-semibold' : '',
                        ].join(' ')}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Amenities row */}
              <tr className="border-b border-gray-50">
                <td className="px-5 py-3.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low border-r border-gray-100">
                  Amenities
                </td>
                {valid.map((p) => (
                  <td key={p.id} className="px-5 py-3.5">
                    {p.amenities?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {p.amenities.map((a) => (
                          <span
                            key={a.label}
                            className="flex items-center gap-0.5 text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-medium"
                          >
                            <span className="material-symbols-outlined text-[11px]">{a.icon}</span>
                            {a.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-on-surface-variant/60">—</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
};

export default ComparePage;
