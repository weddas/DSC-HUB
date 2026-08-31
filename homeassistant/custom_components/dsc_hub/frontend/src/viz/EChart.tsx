import { useEffect, useRef, type CSSProperties } from "react";
import type { ECharts, EChartsCoreOption } from "echarts/core";
import { echarts } from "./echartsSetup";

export function EChart({
  option,
  className,
  style,
  ariaLabel,
}: {
  option: EChartsCoreOption;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const chart = echarts.init(el, undefined, { renderer: "canvas" });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => {
      chart.resize();
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true, lazyUpdate: true });
  }, [option]);

  return (
    <div
      ref={hostRef}
      className={`dsc-echart${className ? ` ${className}` : ""}`}
      style={style}
      role="img"
      aria-label={ariaLabel}
    />
  );
}
