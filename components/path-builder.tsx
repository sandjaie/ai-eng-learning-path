import { savePathBuilderAction, upgradeCurriculumFormAction } from "@/app/actions";

export function PathBuilder() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <p className="text-sm font-bold text-muted">Guided path builder</p>
        <h1 className="font-display mt-2 text-3xl font-bold">Create your learning path</h1>
        <p className="mt-2 text-sm text-muted">
          Define a goal, weekly time, and ordered phases. You can add topics and resources next.
        </p>
      </header>

      <form action={upgradeCurriculumFormAction} className="scc-card space-y-3 p-6">
        <h2 className="font-display text-xl font-bold">Use the AI Engineer curriculum</h2>
        <p className="text-sm text-muted">
          Load the eight-phase default path with resources and achievement criteria.
        </p>
        <button type="submit" className="scc-btn scc-btn-primary">
          Load default curriculum
        </button>
      </form>

      <form action={savePathBuilderAction} className="scc-card space-y-4 p-6">
        <h2 className="font-display text-xl font-bold">Or build your own</h2>
        <label className="block text-sm font-bold">
          Path title
          <input className="scc-input mt-1" name="path_title" defaultValue="My learning path" required />
        </label>
        <label className="block text-sm font-bold">
          Learning goal
          <textarea className="scc-textarea mt-1" name="path_goal" rows={3} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            Weekly goal min (minutes)
            <input
              className="scc-input mt-1"
              name="weekly_goal_min_minutes"
              type="number"
              defaultValue={360}
              min={60}
            />
          </label>
          <label className="block text-sm font-bold">
            Weekly goal max (minutes)
            <input
              className="scc-input mt-1"
              name="weekly_goal_max_minutes"
              type="number"
              defaultValue={480}
              min={60}
            />
          </label>
        </div>
        <label className="block text-sm font-bold">
          Phases (one per line, in order)
          <textarea
            className="scc-textarea mt-1 min-h-40"
            name="phase_titles"
            required
            defaultValue={"Foundations\nCore systems\nApplied projects\nPortfolio and interviews"}
          />
        </label>
        <button type="submit" className="scc-btn scc-btn-primary">
          Create path and activate first phase
        </button>
      </form>
    </div>
  );
}
