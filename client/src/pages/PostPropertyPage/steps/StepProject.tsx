import { useState, useEffect } from 'react';
import { PostPropertyForm } from '../types';
import { projectService, Project } from '../../../services/projectService';

interface Props {
  form: PostPropertyForm;
  onChange: (patch: Partial<PostPropertyForm>) => void;
}

const inputCls = 'w-full border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white';

const StepProject = ({ form, onChange }: Props) => {
  const [projects,    setProjects]    = useState<Project[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showCreate,  setShowCreate]  = useState(false);
  const [creating,    setCreating]    = useState(false);
  const [newName,     setNewName]     = useState('');
  const [newCity,     setNewCity]     = useState('');
  const [newDesc,     setNewDesc]     = useState('');
  const [createErr,   setCreateErr]   = useState('');

  useEffect(() => {
    projectService.getMine()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (p: Project | null) => {
    onChange({ projectId: p?.id ?? undefined, projectName: p?.name ?? undefined });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true); setCreateErr('');
    try {
      const created = await projectService.create({
        name:        newName.trim(),
        city:        newCity.trim() || undefined,
        description: newDesc.trim() || undefined,
      });
      setProjects((prev) => [created, ...prev]);
      onChange({ projectId: created.id, projectName: created.name });
      setShowCreate(false);
      setNewName(''); setNewCity(''); setNewDesc('');
    } catch (err) {
      setCreateErr((err as Error).message ?? 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-on-surface-variant">
        Group this unit under a builder project so buyers can discover all units together. You can skip this and link it later.
      </p>

      {/* Skip / No Project */}
      <button
        type="button"
        onClick={() => handleSelect(null)}
        className={[
          'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors',
          !form.projectId
            ? 'border-primary bg-primary/5'
            : 'border-outline-variant hover:border-primary/50',
        ].join(' ')}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${!form.projectId ? 'text-primary' : 'text-on-surface-variant'}`}
          style={!form.projectId ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {!form.projectId ? 'radio_button_checked' : 'radio_button_unchecked'}
        </span>
        <div>
          <p className="text-sm font-semibold text-on-surface">No project (standalone listing)</p>
          <p className="text-xs text-on-surface-variant mt-0.5">List this property independently</p>
        </div>
      </button>

      {/* Existing projects */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Your Projects</p>
          {projects.map((p) => {
            const selected = form.projectId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p)}
                className={[
                  'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors',
                  selected
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:border-primary/50',
                ].join(' ')}
              >
                <span
                  className={`material-symbols-outlined text-[22px] mt-0.5 flex-shrink-0 ${selected ? 'text-primary' : 'text-on-surface-variant'}`}
                  style={selected ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {selected ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface">{p.name}</p>
                  {(p.city || p.description) && (
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                      {[p.city, p.description].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {p.property_count != null && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {p.property_count} {p.property_count === 1 ? 'unit' : 'units'} listed
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Create new project inline */}
      {!showCreate ? (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create New Project
        </button>
      ) : (
        <form
          onSubmit={handleCreate}
          className="bg-surface-bright rounded-xl border border-outline-variant p-4 space-y-3"
        >
          <p className="text-sm font-bold text-on-surface">New Project</p>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Project Name *
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Lodha Bellagio"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              City
            </label>
            <input
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="e.g. Mumbai"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Luxury residential project near…"
              className={inputCls + ' resize-none'}
            />
          </div>

          {createErr && <p className="text-sm text-red-600">{createErr}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create & Select'}
            </button>
            <button
              type="button"
              onClick={() => { setShowCreate(false); setCreateErr(''); }}
              className="text-sm font-semibold text-on-surface-variant px-3 hover:text-on-surface"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StepProject;
