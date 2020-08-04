export function addChart(res) {
    // const data = res.reduce((acc,sch)=>{
    //     return [...acc, 
    //         {salary: sch.salary, pref: (sch.StdPrefix).split('/')[0],
    //         id: sch.school_id
    //     }]
    // }, [])
    const data = res.filter(sch => sch.school_id != '3');

const margin = {top:20, right:0, bottom:150, left:60};
// const width = document.querySelector('body').clientWidth;
const width = 700;
const height = 400;

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.salary)])
    .range([height - margin.bottom, margin.top]);
    
    // d.StdPrefix ? (d.StdPrefix).split('/')[0] : 'none'
const x = d3.scaleBand()
    .domain(data.map(d => d.Schoolname))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);

const yTitle = g => g.append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 9)
    .attr('y', 10)
    .text('Total Salary');


// const xAxis = g => g
    // .attr('transform', `translate(0, ${height - margin.bottom})`)
    // .call(d3.axisBottom(x).tickSizeOuter(0));


const yAxis = g => g
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(null, 'N'))
    .call(g => g.select('.domain').remove());

const svg = d3.create('svg')
    .attr('viewBox', [0,0,width,height]);

svg.append('g')
    .attr('fill', 'steelblue')
    .selectAll('rect')
    .data(data)
    .join('rect')
        .attr('x', d => x(d.Schoolname))
        .attr('y', d => y(+d.salary))
        .attr('height', d => y(0) - y(+d.salary))
        .attr('width', x.bandwidth())

// svg.append('g')
//     .call(xAxis);
const xAxis = svg.append("g")
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));
    // .call(xAxis);

    
xAxis.selectAll("text")
.attr('font-size', 8)
.attr("transform", "rotate(90)")
.style("text-anchor", "start");

svg.append('g')
    .call(yAxis);

svg.call(yTitle);

document.querySelector('#chart').append(svg.node());
console.log(res);
}