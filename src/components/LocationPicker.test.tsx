import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import LocationPicker from "./LocationPicker";

const { searchPlaceMock } = vi.hoisted(() => ({
  searchPlaceMock: vi.fn(),
}));

vi.mock("../lib/geocode", () => ({
  searchPlace: searchPlaceMock,
}));

function renderLocationPicker(query = "") {
  const onQueryChange = vi.fn();
  const onConfirm = vi.fn();
  render(
    <ChakraProvider value={defaultSystem}>
      <LocationPicker
        query={query}
        onQueryChange={onQueryChange}
        confirmed={null}
        onConfirm={onConfirm}
      />
    </ChakraProvider>,
  );
  return { onQueryChange, onConfirm };
}

describe("LocationPicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    searchPlaceMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("has no native <label> elements", async () => {
    searchPlaceMock.mockResolvedValue([]);
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <LocationPicker
          query="Nowhere"
          onQueryChange={() => {}}
          confirmed={null}
          onConfirm={() => {}}
        />
      </ChakraProvider>,
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(
      container.querySelectorAll('label:not([data-scope="field"])'),
    ).toHaveLength(0);
  });

  it("manual lat/lng inputs still call onConfirm with parsed numbers", async () => {
    searchPlaceMock.mockResolvedValue([]);
    const { onConfirm } = renderLocationPicker("Nowhere");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    fireEvent.change(screen.getByLabelText("Breitengrad"), {
      target: { value: "52.52" },
    });
    fireEvent.change(screen.getByLabelText("Längengrad"), {
      target: { value: "13.405" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Koordinaten verwenden" }),
    );

    expect(onConfirm).toHaveBeenCalledWith({ lat: 52.52, lng: 13.405 });
  });
});
