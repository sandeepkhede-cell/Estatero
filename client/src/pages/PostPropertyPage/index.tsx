import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { PostPropertyForm, EMPTY_FORM, STEPS, generateTitle } from './types';
import StepIndicator from './StepIndicator';
import Step1Type      from './steps/Step1Type';
import Step2Location  from './steps/Step2Location';
import StepProject    from './steps/StepProject';
import Step3Details   from './steps/Step3Details';
import Step4Pricing   from './steps/Step4Pricing';
import Step5Amenities from './steps/Step5Amenities';
import Step6Photos    from './steps/Step6Photos';
import Step7Review    from './steps/Step7Review';
import { propertyService } from '../../services/propertyService';

// ── Validation ────────────────────────────────────────────────────────────────

function validate(step: number, form: PostPropertyForm): string | null {
  if (step === 0 && !form.propertyType)     return 'Please select a property type.';
  if (step === 1 && !form.city)             return 'Please select a city.';
  if (step === 1 && !form.location.trim())  return 'Please enter a locality / address.';
  if (step === 2 && !form.area_sqft)        return 'Please enter the total area.';
  if (step === 3 && !form.price)            return 'Please enter a price.';
  if (step === 6 && !form.title.trim())     return 'Please enter a listing title.';
  return null;
}

const AMENITY_ICONS: Record<string, string> = {
  'Lift':                  'elevator',
  'Parking':               'local_parking',
  'Gym':                   'fitness_center',
  'Swimming Pool':         'pool',
  '24/7 Security':         'security',
  'Garden / Park':         'yard',
  'Club House':            'sports_tennis',
  'Power Backup':          'bolt',
  '24hr Water Supply':     'water_drop',
  'High-Speed Internet':   'wifi',
  'Fire Safety':           'local_fire_department',
  'CCTV Surveillance':     'videocam',
  "Children's Play Area":  'child_friendly',
  'Air Conditioning':      'ac_unit',
  'Laundry Service':       'local_laundry_service',
  'Shuttle Service':       'directions_bus',
};

// ── Form → API payload ────────────────────────────────────────────────────────

function toPayload(form: PostPropertyForm): Record<string, unknown> {
  const num = (v: string) => (v ? Number(v) : undefined);
  return {
    title:           form.title || generateTitle(form),
    description:     form.description || undefined,
    price:           Number(form.price),
    price_per_sqft:  num(form.price_per_sqft),
    emi:             num(form.emi),
    location:        form.location,
    city:            form.city,
    state:           form.state || undefined,
    property_type:   form.propertyType,
    status:          form.listingType,
    bedrooms:        num(form.bedrooms),
    bathrooms:       num(form.bathrooms),
    area_sqft:       num(form.area_sqft),
    floor:           num(form.floor),
    total_floors:    num(form.total_floors),
    furnishing:      form.furnishing  || undefined,
    availability:    form.availability || undefined,
    age_of_property: form.age_of_property || undefined,
    facing:          form.facing || undefined,
    rera_registered: form.rera_registered,
    rera_number:     form.rera_number || undefined,
    is_owner_direct: form.is_owner_direct || undefined,
    project_id:      form.projectId ?? undefined,
    imageUrls:       form.imageUrls.length > 0 ? form.imageUrls : undefined,
    amenities:       form.amenities.length > 0
                       ? form.amenities.map((label) => ({ icon: AMENITY_ICONS[label] ?? '', label }))
                       : undefined,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PostPropertyPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { open: openAuthModal }        = useAuthModal();
  const isBuilder = user?.role === 'builder';

  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal('login');
      navigate('/', { replace: true });
    }
  }, [authLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState<PostPropertyForm>(EMPTY_FORM);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const patch = (update: Partial<PostPropertyForm>) => {
    setForm((prev) => ({ ...prev, ...update }));
    setFieldError(null);
  };

  const handleNext = (totalSteps: number) => {
    const err = validate(step, form);
    if (err) { setFieldError(err); return; }
    if (step === totalSteps - 1) {
      handleSubmit();
    } else {
      // Auto-fill title when entering review step
      if (step === totalSteps - 2 && !form.title) {
        setForm((prev) => ({ ...prev, title: generateTitle(prev) }));
      }
      setStep((s) => s + 1);
      setFieldError(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const property = await propertyService.create(toPayload(form));
      navigate(`/property/${property.id}`);
    } catch (err) {
      setSubmitError((err as Error).message ?? 'Failed to publish. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Build the step list dynamically based on role
  // Builders get an extra "Project" step between Location and Details
  const stepLabels = isBuilder
    ? ['Property Type', 'Location', 'Project', 'Details', 'Pricing', 'Amenities', 'Photos', 'Review']
    : [...STEPS];

  const stepComponents = isBuilder
    ? [
        <Step1Type      form={form} onChange={patch} />,
        <Step2Location  form={form} onChange={patch} />,
        <StepProject    form={form} onChange={patch} />,
        <Step3Details   form={form} onChange={patch} />,
        <Step4Pricing   form={form} onChange={patch} userRole={user.role} />,
        <Step5Amenities form={form} onChange={patch} />,
        <Step6Photos    form={form} onChange={patch} />,
        <Step7Review    form={form} onChange={patch} submitting={submitting} error={submitError} />,
      ]
    : [
        <Step1Type      form={form} onChange={patch} />,
        <Step2Location  form={form} onChange={patch} />,
        <Step3Details   form={form} onChange={patch} />,
        <Step4Pricing   form={form} onChange={patch} userRole={user?.role} />,
        <Step5Amenities form={form} onChange={patch} />,
        <Step6Photos    form={form} onChange={patch} />,
        <Step7Review    form={form} onChange={patch} submitting={submitting} error={submitError} />,
      ];

  const isLastStep = step === stepComponents.length - 1;

  if (authLoading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-bright">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-on-surface">Post Your Property</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Free listing · Reach lakhs of buyers</p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator current={step} total={stepComponents.length} />
        </div>

        {/* Step card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-on-surface mb-6">{stepLabels[step]}</h2>
          {stepComponents[step]}

          {fieldError && (
            <p className="mt-4 text-sm text-error flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              {fieldError}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => step === 0 ? navigate(-1) : setStep((s) => s - 1)}
            className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface font-semibold text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-outline">
              Step {step + 1} of {stepComponents.length}
            </span>
            <button
              type="button"
              onClick={() => handleNext(stepComponents.length)}
              disabled={submitting}
              className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLastStep ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  Publish Listing
                </>
              ) : (
                <>
                  Continue
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPropertyPage;
