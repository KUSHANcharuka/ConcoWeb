"use client"

import { useEffect, useRef } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5map from "@amcharts/amcharts5/map"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"

type GlobeLocation = {
  id: string
  name: string
  latitude: number
  longitude: number
  labelDx?: number
  labelDy?: number
}

const locations: GlobeLocation[] = [
  { id: "LK", name: "Sri Lanka", latitude: 7.8731, longitude: 80.7718, labelDx: 10, labelDy: 20 },
  { id: "IN", name: "India", latitude: 20.5937, longitude: 78.9629, labelDx: 22, labelDy: 10 },
  { id: "SG", name: "Singapore", latitude: 1.3521, longitude: 103.8198, labelDx: 14, labelDy: 22 },
  { id: "AU", name: "Australia", latitude: -25.2744, longitude: 133.7751, labelDx: 18, labelDy: 18 },
  { id: "NZ", name: "New Zealand", latitude: -40.9006, longitude: 174.8860, labelDx: 22, labelDy: 8 },
  { id: "GB", name: "UK", latitude: 55.3781, longitude: -3.4360, labelDx: -6, labelDy: -18 },
  { id: "AE", name: "UAE", latitude: 23.4241, longitude: 53.8478, labelDx: -4, labelDy: -18 },
  { id: "BH", name: "Bahrain", latitude: 25.9304, longitude: 50.6378, labelDx: -4, labelDy: 16 },
  { id: "QA", name: "Qatar", latitude: 25.3548, longitude: 51.1839, labelDx: -10, labelDy: 26 },
  { id: "NG", name: "Nigeria", latitude: 9.0820, longitude: 8.6753, labelDx: -18, labelDy: 14 },
]

const highlightedCountryIds = new Set(locations.map((location) => location.id))

export function GlobalSpendGlobe() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chartNode = chartRef.current
    if (!chartNode) return

    const root = am5.Root.new(chartNode)

    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoOrthographic(),
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        pinchZoom: false,
        paddingTop: 24,
        paddingRight: 40,
        paddingBottom: 24,
        paddingLeft: 40,
        rotationX: -78,
        rotationY: -12,
        zoomLevel: 0.9,
      }),
    )

    const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}))
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0xf5f7fa),
      fillOpacity: 1,
      strokeOpacity: 0,
    })
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    })

    const graticuleSeries = chart.series.push(
      am5map.GraticuleSeries.new(root, {
        step: 10,
      }),
    )

    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0xd9dee5),
      strokeOpacity: 0.45,
      strokeWidth: 1,
    })

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow as never,
        exclude: ["AQ"],
      }),
    )

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0xcfd6dc),
      stroke: am5.color(0xffffff),
      strokeOpacity: 0.8,
      strokeWidth: 1,
      interactive: false,
    })

    polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const id = target.dataItem?.get("id")
      if (id && highlightedCountryIds.has(id)) {
        return am5.color(0x4f8df7)
      }

      return fill
    })

    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}))

    pointSeries.bullets.push((_root, _series, dataItem) => {
      const location = dataItem.dataContext as GlobeLocation

      const container = am5.Container.new(root, {})

      container.children.push(
        am5.Circle.new(root, {
          radius: 4,
          fill: am5.color(0x4f8df7),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
        }),
      )

      const label = am5.Label.new(root, {
        text: location.name,
        populateText: true,
        centerX: am5.p50,
        dx: location.labelDx ?? 0,
        dy: location.labelDy ?? 16,
        fontSize: 10,
        fontWeight: "500",
        fill: am5.color(0x52525b),
        paddingTop: 5,
        paddingRight: 7,
        paddingBottom: 5,
        paddingLeft: 7,
      })

      label.set(
        "background",
        am5.RoundedRectangle.new(root, {
          fill: am5.color(0xffffff),
          fillOpacity: 0.96,
          stroke: am5.color(0xe4e4e7),
          strokeOpacity: 1,
          cornerRadiusTL: 8,
          cornerRadiusTR: 8,
          cornerRadiusBR: 8,
          cornerRadiusBL: 8,
          shadowColor: am5.color(0x000000),
          shadowOpacity: 0.08,
          shadowBlur: 10,
          shadowOffsetY: 2,
        }),
      )

      container.children.push(label)

      return am5.Bullet.new(root, {
        sprite: container,
      })
    })

    pointSeries.data.setAll(locations)

    chart.appear(1000, 100)

    let frameId = 0
    let lastFrame = performance.now()
    let rotationX = chart.get("rotationX") ?? 0

    const rotate = (now: number) => {
      const delta = now - lastFrame
      lastFrame = now
      rotationX = (rotationX + delta * 0.012) % 360
      chart.set("rotationX", rotationX)
      frameId = window.requestAnimationFrame(rotate)
    }

    frameId = window.requestAnimationFrame(rotate)

    return () => {
      window.cancelAnimationFrame(frameId)
      root.dispose()
    }
  }, [])

  return <div ref={chartRef} className="pointer-events-none h-full w-full" aria-label="Rotating global coverage globe" />
}
