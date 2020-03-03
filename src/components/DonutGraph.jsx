const React = require('react')
const ReactDOMServer = require('react-dom/server')
const { JSDOM } = require('jsdom')

const {
  select, scaleOrdinal, pie, arc, stack, scaleBand, scaleLinear, max, axisBottom, axisLeft,
} = require('d3')

const d3 = {
  select, scaleOrdinal, pie, arc, stack, scaleBand, scaleLinear, max, axisBottom, axisLeft,
}

const colors = [
  '#3770B8',
  '#00A3CB',
  '#00D4BB',
  '#6CFB98',
  '#F5FF81',
  '#F6D948',
  '#F6A008',
  '#EF5E00',
  '#E20001',
  '#6822A9',
  '#C0383A',
  '#09783F',
]


const formatDataDonut = (data) => {
  const { aggregations: { results: { buckets } } } = data.responses[0]

  const obj = {}
  buckets.forEach(d => obj[d.key] = d.doc_count)
  return obj
}

const donutGraph = ({
  rawData,
  translate = t => t,
  // field,
  // q,
  // filters = [],
  w = 500,
  // basePath = '/resource/',
}) => {
  const { document } = (new JSDOM('')).window
  global.document = document
  const body = d3.select(document).select('body')

  const data = formatDataDonut(rawData)
  const valuesArray = Object.values(data)
  if (valuesArray.length === 0) return false

  const neededHeight = valuesArray.length * 20 + 15
  const width = w
  const height = (neededHeight < width / 2) ? width / 2 : neededHeight
  const padding = 10
  const legendWidth = 250

  const areaWidth = (width - padding) - legendWidth
  const r = Math.min(areaWidth, height - 10) / 2
  const total = (valuesArray.length && valuesArray.reduce((acc, i) => acc + i)) || 0

  const color = d3.scaleOrdinal()
    .domain(data)
    .range(colors)

  const pieGenerator = d3.pie()
    .value(([, value]) => value)


  const arcGenerator = d3.arc()
    .outerRadius(r)
    .innerRadius(r - 40)

  const arcData = pieGenerator(Object.entries(data))

  const svg = body.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('font-family', '"Source Sans Pro", futura-pt, sans-serif')

  const g = svg.append('g')
    .attr('class', 'graph')
    .attr('transform', `translate(${r + padding}, ${r})`)

  // Arcs
  g.selectAll('path')
    .data(arcData)
    .enter()
    .append('a')
    // .attr('xlink:href', (d) => {
    //   const filterParams = JSON.parse(JSON.stringify(filters))
    //   const fieldValue = d.data[0]
    //   if (!filterParams.some(([key, value]) => key === field && value.includes(fieldValue))) {
    //     const i = filterParams.findIndex(([param]) => param === field)
    //     if (i !== -1) {
    //       filterParams[i][1].push(fieldValue)
    //     } else {
    //       filterParams.push([field, [fieldValue]])
    //     }
    //   }
    //   const urlParams = new URLSearchParams(filterParams
    //     .map(([field, value]) => `filter.${field}=${encodeURIComponent(JSON.stringify(value))}`)
    //     .join('&'))
    //   if (q) {
    //     urlParams.append('q', q)
    //   }
    //   return `${basePath}?${urlParams}`
    // })
    .attr('target', '_parent')
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', d => color(d.data[0]))
    .attr('stroke', 'white')
    .append('title')
    .html(d => `${translate(d.data[0])} (${d.data[1]})`)

  // Labels
  g.selectAll('text')
    .data(arcData)
    .enter()
    .append('text')
    .each((d, i, nodes) => {
      const centroid = arcGenerator.centroid(d)
      select(nodes[i])
        .attr('x', centroid[0])
        .attr('y', centroid[1])
        .attr('dy', '0.33em')
        .attr('fill', 'white')
        .attr('pointer-events', 'none')
        .style('text-shadow', '1px 1px .1px black')
        .text((d) => {
          // eslint-disable-next-line no-bitwise
          const percentage = ~~(d.data[1] * 100 / total)
          return (percentage > 3 ? `${percentage}%` : '')
        })
        .attr('text-anchor', 'middle')
        .attr('font-weight', 400)
        .attr('font-size', '13px')
    })

  // Legend
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${areaWidth + padding * 3}, -${height})`)

  const lg = legend.selectAll('g')
    .data(arcData)
    .enter()
    .append('g')
    .attr('class', 'legendGroup')
    .attr('transform', (d, i) => `translate(0, ${(height + 15) + 20 * i})`)

  lg.append('rect')
    .attr('fill', d => color(d.data[0]))
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 10)
    .attr('height', 10)
    .append('title')
    .html(d => d.data[1])

  lg.append('text')
    .style('font-size', '13px')
    .attr('x', 20)
    .attr('y', 10)
    .text((d) => {
      const translated = translate(d.data[0])
      return translated.length > 25 ? `${translated.slice(0, 25)}...` : translated
    })
    .append('title')
    .html(d => `${translate(d.data[0])} (${d.data[1]})`)

  // return body.node().innerHTML
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,

  }, svg.node().innerHTML)
}


module.exports = donutGraph
