import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 600;
const height = 300;
const chartCanvas = new ChartJSNodeCanvas({ width, height });

export async function generateChartImage(
  title: string,
  labels: string[],
  values: number[],
  type: "bar" | "pie" = "bar"
): Promise<Buffer> {
  return chartCanvas.renderToBuffer({
    type,
    data: {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: [
            "#4e73df",
            "#1cc88a",
            "#36b9cc",
            "#f6c23e",
            "#e74a3b",
          ],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
        },
        legend: { display: type === "pie" },
      },
      responsive: false,
      maintainAspectRatio: false,
    },
  });
}
