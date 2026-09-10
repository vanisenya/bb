import { describe, expect, it } from "vitest";
import { PERSONAL_PROJECT_ID } from "@bb/domain";
import {
  resolveNewThreadProjectId,
  resolveRootComposeProjectId,
} from "./root-compose-selection";

describe("resolveNewThreadProjectId", () => {
  it("keeps a real route project over the default project", () => {
    expect(
      resolveNewThreadProjectId({
        routeProjectId: "proj_route",
        defaultProjectId: "proj_default",
      }),
    ).toBe("proj_route");
  });

  it("uses the default project outside a project route", () => {
    expect(
      resolveNewThreadProjectId({
        routeProjectId: undefined,
        defaultProjectId: "proj_default",
      }),
    ).toBe("proj_default");
  });

  it("uses the default project on a personal thread route", () => {
    expect(
      resolveNewThreadProjectId({
        routeProjectId: PERSONAL_PROJECT_ID,
        defaultProjectId: "proj_default",
      }),
    ).toBe("proj_default");
  });

  it("keeps personal and root-compose behavior when no default is set", () => {
    expect(
      resolveNewThreadProjectId({
        routeProjectId: PERSONAL_PROJECT_ID,
        defaultProjectId: null,
      }),
    ).toBe(PERSONAL_PROJECT_ID);
    expect(
      resolveNewThreadProjectId({
        routeProjectId: undefined,
        defaultProjectId: null,
      }),
    ).toBeUndefined();
  });
});

describe("resolveRootComposeProjectId", () => {
  it("prefers the remembered project over the default project", () => {
    expect(
      resolveRootComposeProjectId({
        storedProjectId: "proj_last",
        defaultProjectId: "proj_default",
      }),
    ).toBe("proj_last");
  });

  it("starts a client with nothing stored in the default project", () => {
    expect(
      resolveRootComposeProjectId({
        storedProjectId: null,
        defaultProjectId: "proj_default",
      }),
    ).toBe("proj_default");
    expect(
      resolveRootComposeProjectId({
        storedProjectId: null,
        defaultProjectId: null,
      }),
    ).toBe(PERSONAL_PROJECT_ID);
  });
});
