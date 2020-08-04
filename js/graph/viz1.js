const data = [4, 8, 15, 16, 23, 42];
const data2 = [{grd:'A', value:4}, {grd:'C', value:8}, {grd:'P', value:15}, {grd:'F', value:16}];

/*******USING SVG GRAPHICS****** */
let width = 420;

/***********Fits the Chart to Scale********** */
let x = d3.scaleLinear()
  .domain([0, d3.max(data2, d => d.value)]) //.domain([0, d3.max(data)])
  .range([0, width]);

let y = d3.scaleBand()
  // .domain(d3.range(data.length))
  .domain(data2.map(d => d.grd))
  .range([0, 20*data2.length]);


const svg = d3.create('svg')
  .attr('width', width)
  .attr('height', y.range()[1])
  .attr('font-family', 'sans-serif')
  .attr('font-size', 10)
  .attr('text-anchor', 'end');

const bar = svg.selectAll('g')
  .data(data2)
  .join('g')
  // .attr('transform', (d, i) => `translate(0, ${y(i)})`);
  .attr('transform', d => `translate(0, ${y(d.grd)})`);

bar.append('rect')
  .attr('fill', 'steelblue')
  // .attr('width', x)
  .attr('width', d => x(d.value))
  .attr('height', y.bandwidth() - 1);

bar.append('text')
  .attr('fill', 'white')
  // .attr('x', d => x(d) - 3)
  .attr('x', d => x(d.value) - 3)
  .attr('y', y.bandwidth() / 2)
  .attr('dy', '0.35em')
  .text(d => d.value)

  document.querySelector('body').append(svg.node());

/**************USING HTML ELEMENTS*************** */
// const div = d3.create("div")
//     .style("font", "10px sans-serif")
//     .style("text-align", "right")
//     .style("color", "white");

// div.selectAll("div")
//   .data(data)
//   .join("div")
//     .style("background", "steelblue")
//     .style("padding", "3px")
//     .style("margin", "1px")
//     .style("width", d => `${x(d)}px`)
//     .text(d => d);
//   document.querySelector('body').append(div.node());
