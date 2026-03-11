import { useCallback, useEffect, useState } from "react";
import { fetchHawkerCentres } from "../api/hawkerApi";
import { getRegion } from "../utils/regionUtils";

function toTitleCase(value) {
  return String(value)
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeFeature(feature, index) {
  const properties = feature?.properties ?? {};
  const coordinates = feature?.geometry?.coordinates ?? [];
  const [lng, lat] = coordinates;

  const postalCode = properties.ADDRESSPOSTALCODE ?? "";
  const name = properties.NAME ? toTitleCase(properties.NAME) : "";
  const addressStreet = properties.ADDRESSSTREETNAME
    ? toTitleCase(properties.ADDRESSSTREETNAME)
    : "";
  const houseNumber = properties.ADDRESSBLOCKHOUSENUMBER ?? "";
  const address = [houseNumber, addressStreet].filter(Boolean).join(" ");

  const latitude = Number.parseFloat(lat);
  const longitude = Number.parseFloat(lng);

  if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return {
    id: String(properties.OBJECTID ?? postalCode ?? `${name}-${index}`),
    name,
    address,
    postalCode: String(postalCode),
    lat: latitude,
    lng: longitude,
    region: getRegion({
      lat: latitude,
      lng: longitude,
      name,
      address,
    }),
  };
}

export function useHawkerData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);

  const retry = useCallback(() => {
    setRetryToken((previous) => previous + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const geojson = await fetchHawkerCentres(controller.signal);
        const features = geojson?.features ?? [];

        const normalized = features
          .map((feature, index) => normalizeFeature(feature, index))
          .filter(Boolean);

        const skipped = features.length - normalized.length;
        if (skipped > 0) {
          console.warn(
            `Skipped ${skipped} records due to invalid coordinates or missing names.`,
          );
        }

        setData(normalized);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError("Unable to load hawker centre data. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [retryToken]);

  return { data, isLoading, error, retry };
}
