import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import LocationPicker from "./LocationPicker";

const { searchPlaceMock } = vi.hoisted(() => ({
  searchPlaceMock: vi.fn(),
}));

vi.mock("@/features/location/services/geocodeApi", () => ({
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

  it("debounces geocode search for the query prop", async () => {
    searchPlaceMock.mockResolvedValue([]);
    render(
      <ChakraProvider value={defaultSystem}>
        <LocationPicker
          query="Berlin"
          onQueryChange={() => {}}
          confirmed={null}
          onConfirm={() => {}}
        />
      </ChakraProvider>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(searchPlaceMock).toHaveBeenCalledWith("Berlin");
  });

  it("selecting a combobox result calls onConfirm with coordinates", async () => {
    searchPlaceMock.mockResolvedValue([
      { label: "Berlin, Germany", lat: 52.52, lng: 13.405 },
    ]);
    const onConfirm = vi.fn();
    render(
      <ChakraProvider value={defaultSystem}>
        <LocationPicker
          query="Berlin"
          onQueryChange={() => {}}
          confirmed={null}
          onConfirm={onConfirm}
        />
      </ChakraProvider>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    fireEvent.click(screen.getByText("Berlin, Germany"));

    expect(onConfirm).toHaveBeenCalledWith({ lat: 52.52, lng: 13.405 });
  });

  it("does not render manual latitude and longitude fields", async () => {
    searchPlaceMock.mockResolvedValue([]);
    renderLocationPicker("Nowhere");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(screen.queryByLabelText("Breitengrad")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Längengrad")).not.toBeInTheDocument();
  });
});
