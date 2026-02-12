import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../src/components/Header";

describe("Header", () => {
  it("should show 'Connected' when connected", () => {
    render(<Header connected={true} onLogout={() => {}} />);
    expect(screen.getByText("Connected")).toBeDefined();
  });

  it("should show 'Disconnected' when not connected", () => {
    render(<Header connected={false} onLogout={() => {}} />);
    expect(screen.getByText("Disconnected")).toBeDefined();
  });

  it("should call onLogout when clicking Logout", () => {
    const onLogout = vi.fn();
    render(<Header connected={true} onLogout={onLogout} />);
    fireEvent.click(screen.getByText("Logout"));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
