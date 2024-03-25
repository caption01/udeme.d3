import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const canvas = d3.select('.canvas')
const svg = canvas.append('svg')
    .attr('width', 600)
    .attr('height', 600)

// create margins and dimensions
const margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
}

const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g');

d3.json('./menu.json')
    .then((data) => {
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.order)])
            .range([graphHeight, 0])

        const x = d3.scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, 500])
            .paddingInner(0.2)
            .paddingOuter(0.2)

        graph.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('width', x.bandwidth)
            .attr('height', (d) => graphHeight - y(d.order))
            .attr('fill', 'orange')
            .attr('x', (d, i) => x(d.name))
            .attr('y', (d, i) => y(d.order))

        // create and call axes
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y)
            .ticks(10)
            .tickFormat((d) => `${d} order`)

        xAxisGroup.call(xAxis)
        yAxisGroup.call(yAxis)

        xAxisGroup.selectAll('text')
            .attr('transform', 'rotate(-40)')
            .attr('text-anchor', 'end')
            .attr('fill', 'orange')
    })





