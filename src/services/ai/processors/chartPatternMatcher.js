export const chartPatterns = {
  // Chart Type Patterns
  chartType: [
    "make {this|the chart|it} {a|an} {type} chart",
    "change {this|the chart|it} to {a|an} {type} chart",
    "switch to {type} chart",
    "display {the data|this} as {a|an} {type} chart",
    "visualize {the data|this} as {a|an} {type} chart"
  ],

  // Data Configuration Patterns
  dataConfig: [
    "use {query} for {the|this} chart",
    "plot {field} against {field}",
    "show {field} over time",
    "compare {field} and {field}",
    "map {field} to {the x-axis|the y-axis}",
    "use {field} as {labels|values}"
  ],

  // Series Styling Patterns
  seriesStyling: [
    "make {series} {color}",
    "change {the color of|} {series} to {color}",
    "style {series} with {color} {line|bars|points}",
    "set {series} opacity to {number}%",
    "make {series} {dashed|dotted|solid}"
  ],

  // Visual Elements Patterns
  visualElements: [
    "{show|hide} {the|} {legend|grid|data points|axes}",
    "move {the|} legend to {the|} {position}",
    "make {the|} grid {color}",
    "set {the|} background {color}",
    "{add|remove} {data labels|tooltips}"
  ],

  // Axis Configuration Patterns
  axisConfig: [
    "format {x|y}-axis as {format}",
    "rotate {x|y}-axis labels by {number} degrees",
    "set {x|y}-axis range from {number} to {number}",
    "{show|hide} {x|y}-axis {labels|ticks|lines}",
    "make {x|y}-axis {logarithmic|linear}"
  ],

  // Title Configuration Patterns
  titleConfig: [
    "set {the|} title to {text}",
    "make {the|} title {color}",
    "change title {size|font} to {value}",
    "align title to {the|} {position}",
    "{show|hide} {the|} title"
  ],

  // Tooltip Configuration Patterns
  tooltipConfig: [
    "format tooltips as {format}",
    "set tooltip {background|border|text} {color}",
    "{show|hide} tooltip {border|values|labels}",
    "make tooltips {rounded|square}",
    "set tooltip padding to {number}px"
  ],

  // Animation Patterns
  animation: [
    "{enable|disable} animations",
    "set animation duration to {number} {ms|seconds}",
    "animate {series} with {effect}",
    "make transitions {faster|slower}",
    "{add|remove} hover effects"
  ]
}; 