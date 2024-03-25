import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


import { getData } from './firestore.mjs'

const dims = {
    height: 300,
    width: 300,
    radius: 150
}

const cent = {
    x: ((dims.width / 2) + 5),
    y: ((dims.height / 2) + 5),
}

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 150)
    .attr('height', dims.height + 150)

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`)


const pie = d3.pie()
    .sort(null)
    .value(d => d.cost)

// function to generate path 
const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 2)

const colors = d3.scaleOrdinal(d3['schemeSet3'])

// legend setup
// const legendGroup = svg.append('g')
//     .attr('transform', `translate(${dims.width + 40}, 10)`)

// const legend = d3.legendColor()
//     .shape('circle')
//     .scale(colors)

const update = (data) => {
    // update colors scale domain
    colors.domain(data.map(d => d.name))

    // update and call legend
    // legendGroup.call(legend)

    // join enhanced pie data
    const paths = graph.selectAll('path')
        .data(pie(data))

    // handle remove
    paths
        .exit()
        .transition().duration(750)
        .attrTween('d', arcTweenExist)
        .remove()

    // handle current dom
    paths
        .attr('d', arcPath)
        .transition().duration(750)
            .attrTween('d', arcTweenUpdate)

    // handle new
    paths.enter()
        .append('path')
            .attr('class', 'arc')
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('fill', (d) => colors(d.data.name))
            .each(function(d){ this._current = d })
            .transition().duration(750)
                .attrTween('d', arcTweenEnter)
}

getData([], update)


function arcTweenEnter(d){
    const i = d3.interpolate(d.endAngle, d.startAngel)
    return (t) => {
        d.startAngel = i(t)
        return arcPath(d)
    }
}

function arcTweenExist(d){
    const i = d3.interpolate(d.startAngel, d.endAngle)
    return (t) => {
        d.startAngel = i(t)
        return arcPath(d)
    }
}

function arcTweenUpdate(d){
    // interpolate betwwen the two object
    const i = d3.interpolate(d._current, d)
    this._current = d
    return (t) => {
        return arcPath(i(t))
    }
}