// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GeneralSettingsSection } from "./SettingsView";

afterEach(cleanup);

const PROJECT_OPTIONS = [
  { id: "proj_web", name: "bb-web" },
  { id: "proj_docs", name: "Docs" },
];

function renderSection(
  defaultProjectId: string | null,
  onDefaultProjectIdChange: (projectId: string | null) => void = vi.fn(),
) {
  return render(
    <GeneralSettingsSection
      defaultProjectDisabled={false}
      defaultProjectId={defaultProjectId}
      defaultProjectOptions={PROJECT_OPTIONS}
      desktopBrowserAvailable={false}
      onDefaultProjectIdChange={onDefaultProjectIdChange}
      managedBranchPrefix="bb/"
      managedBranchPrefixDisabled={false}
      navigateToThreadAfterCreate={false}
      onManagedBranchPrefixChange={vi.fn()}
      onNavigateToThreadAfterCreateChange={vi.fn()}
      onOpenLinksInAppBrowserChange={vi.fn()}
      onRewriteLocalhostLinksChange={vi.fn()}
      onRichTextEditingChange={vi.fn()}
      onSteerActiveThreadOnEnterChange={vi.fn()}
      onStreamerModeChange={vi.fn()}
      openLinksInAppBrowser={false}
      rewriteLocalhostLinks={false}
      richTextEditing={false}
      steerActiveThreadOnEnter={false}
      steerActiveThreadOnEnterDisabled={false}
      streamerMode={false}
      streamerModeDisabled={false}
    />,
  );
}

function defaultProjectTrigger() {
  return screen.getByRole("button", {
    name: "Default project for new threads",
  });
}

async function openDefaultProjectMenu() {
  fireEvent.pointerDown(defaultProjectTrigger(), { button: 0 });
  return screen.findByRole("menu");
}

describe("default project setting", () => {
  it("shows the personal option when no default project is set", () => {
    renderSection(null);
    expect(defaultProjectTrigger().textContent).toContain(
      "Personal (no project)",
    );
  });

  it("shows the selected project name", () => {
    renderSection("proj_docs");
    expect(defaultProjectTrigger().textContent).toContain("Docs");
  });

  it("saves a chosen project", async () => {
    const onChange = vi.fn();
    renderSection(null, onChange);
    await openDefaultProjectMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "bb-web" }));
    expect(onChange).toHaveBeenCalledWith("proj_web");
  });

  it("clears the default with the personal option", async () => {
    const onChange = vi.fn();
    renderSection("proj_web", onChange);
    await openDefaultProjectMenu();
    fireEvent.click(
      screen.getByRole("menuitem", { name: "Personal (no project)" }),
    );
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
