export const colors = [
  "#e4405f", // Red
  "#6b46c1", // Purple
  "#4338ca", // Indigo
  "#1d4ed8", // Blue
  "#0ea5e9", // Light Blue
  "#64748b", // Slate
  "#22c55e", // Green
  "#eab308", // Yellow
  "#f97316", // Orange
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#a855f7", // Violet
  "#84cc16", // Lime
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#f43f5e", // Rose
  "#10b981", // Emerald
  "#facc15", // Yellow
  "#fb923c", // Orange
  "#d946ef", // Fuchsia
  "#2dd4bf", // Teal
];

export const replaceYouTubeLinks = (source: string) => {
  return source.replace(/\[(!.*)\]\((.*(youtube\.com\/watch|youtu\.be).*?)(?:\s"(.*?)")?\)/gi, (all, preview, url) => {
    const [, query] = url.match(/\?(.*)/) || url.match(/.*youtu\.be\/(.*)/);
    const params = query.split("&").reduce((res: Record<string, string>, param: string) => {
      let [key, val] = param.split("=");
      if (param === key) {
        key = "v";
        val = param;
      }
      return Object.assign(res, { [key]: val });
    }, {});
    const { v, t } = params;
    const path = t ? `${v}?start=${t}` : `${v}?`;

    return `[youtube:${v}:${path}]`;
  });
};
