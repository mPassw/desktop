class ExportState {
    public exportType: "json" | "csv" = $state("json");
}

export const exportState = new ExportState();
