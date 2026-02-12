import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Chat from "../src/components/Chat";

describe("Chat", () => {
  it("should show 'No messages yet' when empty", () => {
    render(<Chat messages={[]} onSend={() => {}} />);
    expect(screen.getByText("No messages yet")).toBeDefined();
  });

  it("should display messages", () => {
    const messages = [
      { city: "Sydney", body: "Hello!", sender: "user1", timestamp: new Date().toISOString() },
    ];
    render(<Chat messages={messages} onSend={() => {}} />);
    expect(screen.getByText("user1")).toBeDefined();
    expect(screen.getByText("Hello!")).toBeDefined();
  });

  it("should call onSend when clicking Send", () => {
    const onSend = vi.fn();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "test message" } });
    fireEvent.click(screen.getByText("Send"));
    expect(onSend).toHaveBeenCalledWith("test message");
  });

  it("should clear input after sending", () => {
    render(<Chat messages={[]} onSend={() => {}} />);
    const input = screen.getByPlaceholderText("Type a message...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(screen.getByText("Send"));
    expect(input.value).toBe("");
  });
});
