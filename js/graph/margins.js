export function addChart(res) {
    // const data = res.reduce((acc,sch)=>{
    //     return [...acc, 
    //         {salary: sch.salary, pref: (sch.StdPrefix).split('/')[0],
    //         id: sch.school_id
    //     }]
    // }, [])
    // const exclud = ['0', '3', '11', '5', '2', '9', '1'];
    // const data = res.filter(sch => !exclud.includes(sch.school_id));
    const data = res;

const margin = {top:20, right:40, bottom:170, left:60};
// const width = document.querySelector('body').clientWidth;
const width = 750;
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
    .attr('font-weight', 'bold')
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
.attr('font-size', 9)
.attr('font-weight', 'bold')
.attr("transform", "rotate(70)")
.attr("x", "10")
.attr("y", "-3")
.style("text-anchor", "start");

svg.append('g')
    .call(yAxis);

svg.call(yTitle);

document.querySelector('#chart').append(svg.node());
// console.log(res);


let snum = 1;
let dRow = '';
data.forEach(sch => dRow += `
    <tr>
        <td>${snum++}</td>
        <td>${sch.Schoolname}</td>
        <td>${(+sch.salary).toLocaleString('en-NG',{style:'currency', currency:'NGN'})}</td>
        <td>${sch.size}</td>
        <td>${(sch.salary/sch.size).toLocaleString('en-NG',{style:'currency', currency:'NGN'})}</td>
    </tr>
`);
const salTable = `
<h2>School Total Payable Salary</h2>
<div class="table-responsive">
<table class="table table-striped table-sm">
  <thead class='oxblood'>
    <tr>
      <th>S/No.</th>
      <th>School</th>
      <th>Total Salary</th>
      <th>Staff Size</th>
      <th>Average</th>
    </tr>
  </thead>
  <tbody>
    ${dRow}
  </tbody>
</table>
</div>`

document.querySelector('main').innerHTML += salTable;
}