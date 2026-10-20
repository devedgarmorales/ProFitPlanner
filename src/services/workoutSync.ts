import { LocalWorkout, WorkoutSnapshot } from '../interfaces/client';
interface SyncDependencies {
  read: () => LocalWorkout[];
  send: (snapshot: WorkoutSnapshot) => Promise<unknown>;
  acknowledge: (id: string, revision: number) => void;
  snapshot: (workout: LocalWorkout) => WorkoutSnapshot;
}
export function createWorkoutSync(dependencies: SyncDependencies) {
  let flight: Promise<void> | undefined;
  return function sync() {
    if (flight) {
      return flight;
    }
    flight = (async () => {
      // A bounded second pass catches edits made during the first request without a retry loop.
      for (let pass = 0; pass < 2; pass += 1) {
        const pending = dependencies
          .read()
          .filter((session) => session.pending);
        if (!pending.length) {
          break;
        }
        for (const session of pending) {
          await dependencies.send(dependencies.snapshot(session));
          dependencies.acknowledge(session.id, session.revision);
        }
      }
    })().finally(() => {
      flight = undefined;
    });
    return flight;
  };
}
