import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getFirestore, collection, getDocs, onSnapshot, doc, query } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

const db = getFirestore();

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

// scales
const y = d3.scaleLinear().range([graphHeight, 0])
const x = d3.scaleBand().range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2)

// create and call axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
    .ticks(10)
    .tickFormat((d) => `${d} orders`)

// update axes
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange')

// update function
const update = (data) => {
    y.domain([0, d3.max(data, (d) => d.orders)])
    x.domain(data.map((d) => d.name))

    const rects = graph.selectAll('rect').data(data)

    // remove existing collection
    rects.exit().remove()

    // update current shapes in dom
    rects.attr('width', x.bandwidth)
        .attr('height', (d) => graphHeight - y(d.orders))
        .attr('fill', 'orange')
        .attr('x', (d, i) => x(d.name))
        .attr('y', (d, i) => y(d.orders))

    // append new dom
    rects.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', (d) => graphHeight - y(d.orders))
        .attr('fill', 'orange')
        .attr('x', (d, i) => x(d.name))
        .attr('y', (d, i) => y(d.orders))

    // call axis
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
}

let data = []

const dishesQuery = query(collection(db, "dishes"))

const unsub = onSnapshot(dishesQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const doc = {
            ...change.doc.data(),
            id: change.doc.id
        }

        if (change.type === "added") {
            data.push(doc)
        }
        if (change.type === "modified") {
            const index = data.findIndex((data) => data.id === doc.id)
            data[index] = doc
        }
        if (change.type === "removed") {
            data = data.filter((data) => data.id !== doc.id)
        }
    })

    update(data)
});


