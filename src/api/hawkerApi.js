const DATASET_ID = "d_4a086da0a5553be1d89383cd90d07ecd";
const DATASET_DOWNLOAD_ENDPOINT = `https://api-open.data.gov.sg/v1/public/api/datasets/${DATASET_ID}/poll-download`;
const LOCAL_FALLBACK_GEOJSON = "/HawkerCentresGEOJSON.geojson";

export async function fetchHawkerCentres(signal) {
  try {
    const response = await fetch(DATASET_DOWNLOAD_ENDPOINT, { signal });
    if (!response.ok) {
      throw new Error(
        `Download endpoint failed with status ${response.status}`,
      );
    }

    const payload = await response.json();
    const geojsonUrl = payload?.data?.url;

    if (!geojsonUrl) {
      throw new Error("Download URL missing in dataset response");
    }

    const geojsonResponse = await fetch(geojsonUrl, { signal });
    if (!geojsonResponse.ok) {
      throw new Error(
        `GeoJSON fetch failed with status ${geojsonResponse.status}`,
      );
    }

    return await geojsonResponse.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    const fallbackResponse = await fetch(LOCAL_FALLBACK_GEOJSON, { signal });
    if (!fallbackResponse.ok) {
      throw error;
    }

    return await fallbackResponse.json();
  }
}
