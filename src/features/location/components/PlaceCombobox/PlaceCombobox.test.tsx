import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import PlaceCombobox from "./PlaceCombobox";
import type { PlaceCandidate } from "@/features/location/types/place";

const berlin: PlaceCandidate = {
  label: "Berlin, Germany",
  lat: 52.52,
  lng: 13.405,
};

function renderPlaceCombobox(
  props: Partial<ComponentProps<typeof PlaceCombobox>> = {},
) {
  const onQueryChange = vi.fn();
  const onSelect = vi.fn();
  render(
    <ChakraProvider value={defaultSystem}>
      <PlaceCombobox
        query=""
        onQueryChange={onQueryChange}
        candidates={[]}
        searching={false}
        onSelect={onSelect}
        {...props}
      />
    </ChakraProvider>,
  );
  return { onQueryChange, onSelect };
}

function ControlledPlaceComboboxHarness({
  onSelect,
}: {
  onSelect: (candidate: PlaceCandidate) => void;
}) {
  const [query, setQuery] = useState("");
  const candidates = query.trim() ? [berlin] : [];

  return (
    <PlaceCombobox
      query={query}
      onQueryChange={setQuery}
      candidates={candidates}
      searching={false}
      onSelect={onSelect}
    />
  );
}

function comboboxInput() {
  return screen.getByRole("combobox");
}

describe("PlaceCombobox", () => {
  it("closes the dropdown after selecting a candidate while keeping the label in the input", async () => {
    const onSelect = vi.fn();
    render(
      <ChakraProvider value={defaultSystem}>
        <ControlledPlaceComboboxHarness onSelect={onSelect} />
      </ChakraProvider>,
    );

    const input = screen.getByPlaceholderText("Ort suchen …");
    fireEvent.change(input, { target: { value: "Berlin" } });

    await waitFor(() => {
      expect(comboboxInput()).toHaveAttribute("aria-expanded", "true");
    });

    fireEvent.click(screen.getByText("Berlin, Germany"));

    expect(onSelect).toHaveBeenCalledWith(berlin);
    expect(input).toHaveValue("Berlin, Germany");
    await waitFor(() => {
      expect(comboboxInput()).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("does not show the list when the query is empty and the user has not typed", () => {
    renderPlaceCombobox({ query: "", candidates: [berlin] });

    expect(comboboxInput()).toHaveAttribute("aria-expanded", "false");
  });
});
