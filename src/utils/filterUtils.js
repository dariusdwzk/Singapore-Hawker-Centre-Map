export function filterHawkers(data, searchQuery, regionFilter) {
  const normalizedSearch = searchQuery.trim().toLowerCase();

  return data.filter((hawker) => {
    const matchesSearch = hawker.name.toLowerCase().includes(normalizedSearch);
    const matchesRegion =
      regionFilter === "all" || hawker.region === regionFilter;

    return matchesSearch && matchesRegion;
  });
}
