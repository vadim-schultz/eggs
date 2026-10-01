import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import PostFormField from "./PostFormField";

function renderField(
  props: Partial<ComponentProps<typeof PostFormField>> = {},
) {
  const onChange = vi.fn();
  const view = render(
    <ChakraProvider value={defaultSystem}>
      <PostFormField
        labelKey="post.eggCount.label"
        value=""
        onChange={onChange}
        {...props}
      />
    </ChakraProvider>,
  );
  return { onChange, ...view };
}

describe("PostFormField", () => {
  it("reports the typed value from the labeled input", () => {
    const { onChange } = renderField();

    fireEvent.change(screen.getByLabelText("Anzahl Eier"), {
      target: { value: "12" },
    });

    expect(onChange).toHaveBeenCalledWith("12");
  });

  it("shows a listing error through Field.ErrorText", () => {
    const { container } = renderField({ errorKey: "post.errors.eggCount" });

    expect(
      screen.getByText("Die Anzahl muss größer als 0 sein."),
    ).toHaveAttribute("data-part", "error-text");
    expect(
      container.querySelectorAll('label:not([data-scope="field"])'),
    ).toHaveLength(0);
  });

  it("omits error text when errorKey is absent", () => {
    const { container } = renderField();

    expect(container.querySelector('[data-part="error-text"]')).toBeNull();
  });

  it("renders a textarea for multiline notes", () => {
    renderField({ labelKey: "post.note.label", multiline: true });

    expect(screen.getByLabelText("Notiz (optional)").tagName).toBe("TEXTAREA");
  });
});
