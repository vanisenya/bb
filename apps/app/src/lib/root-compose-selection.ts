import { atom, useAtom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { PERSONAL_PROJECT_ID } from "@bb/domain";
import { createLocalStorageSyncStorage } from "./browser-storage";
import { isProjectlessProjectId } from "./route-paths";

const ROOT_COMPOSE_PROJECT_ID_STORAGE_KEY = "bb.root-compose.project-id";

function parseStoredProjectId(
  storedValue: string | null,
  initialValue: string | null,
): string | null {
  return storedValue && storedValue.length > 0 ? storedValue : initialValue;
}

const rootComposeProjectIdStorage = createLocalStorageSyncStorage<
  string | null
>({
  parse: parseStoredProjectId,
  serialize: (value) => value ?? "",
});

const rootComposeProjectIdAtom = atomWithStorage<string | null>(
  ROOT_COMPOSE_PROJECT_ID_STORAGE_KEY,
  null,
  rootComposeProjectIdStorage,
  { getOnInit: true },
);

const rootComposeReuseEnvironmentAtom = atom<string | null>(null);

interface ResolveRootComposeProjectIdArgs {
  storedProjectId: string | null;
  defaultProjectId: string | null;
}

export function resolveRootComposeProjectId({
  storedProjectId,
  defaultProjectId,
}: ResolveRootComposeProjectIdArgs): string {
  return storedProjectId ?? defaultProjectId ?? PERSONAL_PROJECT_ID;
}

interface ResolveNewThreadProjectIdArgs {
  routeProjectId: string | undefined;
  defaultProjectId: string | null;
}

export function resolveNewThreadProjectId({
  routeProjectId,
  defaultProjectId,
}: ResolveNewThreadProjectIdArgs): string | undefined {
  if (routeProjectId !== undefined && !isProjectlessProjectId(routeProjectId)) {
    return routeProjectId;
  }
  return defaultProjectId ?? routeProjectId;
}

export function useRootComposeProjectId(defaultProjectId: string | null) {
  const [storedProjectId, setRootComposeProjectId] = useAtom(
    rootComposeProjectIdAtom,
  );
  return [
    resolveRootComposeProjectId({ storedProjectId, defaultProjectId }),
    setRootComposeProjectId,
  ] as const;
}

export function useSetRootComposeProjectId() {
  return useSetAtom(rootComposeProjectIdAtom);
}

export function useRootComposeReuseEnvironment() {
  return useAtom(rootComposeReuseEnvironmentAtom);
}
