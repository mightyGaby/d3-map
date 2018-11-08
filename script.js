var num;
var potholeData = [];
var centroids = [];
var circles = [];

function getPotholeData(){
	$.each(patched, function(key,data){
		ward = data.ward;
		amtFilled = data["number_of_potholes_filled_on_block"];
		fillDate = data["completion_date"];
		reportDate = data["creation_date"];

		var datarow = {
			"ward": ward,
	       	"number_filled": amtFilled,
	       	"date_reported": fillDate,
	       	"date_filled": reportDate
		};

		potholeData.push(datarow);
	});
};

function getCentroid(){
	d3.selectAll('path')
		.each(function(){
			var mapWard = this.id,
				bbox = this.getBBox(),
				centroid = [bbox.x + bbox.width/2, bbox.y + bbox.height/2];

			var datarow = {
				"ward": mapWard,
				"center": {
					"x": centroid[0],
					"y": centroid[1]
				}
			}

		centroids.push(datarow);
	});
};

function drawCircles(){
	$.each(potholeData, function(key,data){
		var cx, cy;
		var circle = {
				r: data["amtFilled"],
		        fill: 'green',
		        cx: 50,
		        cy: 30
			};
		
		circles.push(circle);
	});
	return(circles);
}


function projectData(){
	var state = d3.selectAll('path')
				.attr('fill', function(d){
	 
		// Get the ID of the path we are currently working with
		// Our SVG uses the state abbreviation for the ID
		var mapWard = this.id;
	 
		// Loop through the state data looking for
		// a match for that abbreviation
		// Then returning the corresponding president
		// who won that state, from the array we made earlier
		$.each(potholeData, function(key, data){
			if(data.ward === mapWard){
				num = data["number_filled"];
			}
		})
	 
		// Return colors
		// based on data					
		if(num <= 5){
			return "blue"
		}
		else if(num > 5 && num <= 10){
			return "red"
		}
		else {
			return "yellow"
		}
	});
};

function projectCircles(data){
  var d3_body = d3.select("svg")
  var circles = d3_body.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle");

          circles = d3.selectAll("circle")
                    .data(data)
                      .transition()
                      .duration(2000)
                      .delay( function(d,i){ return i * 200 })
                      .attr('r', function(d){return d.r})
                      .attr('cx', function(d){return d.cx})
                      .attr('cy', function(d){return d.cy})
                      .attr('fill', function(d){return d.fill})
                      .transition()
                      .duration(2000)
                      .attr('opacity', function(d){return 0})
                      .attr('r', 0)
                      console.log(circles);

  d3_body.selectAll('circle').data(data).exit().remove();
}

window.onload = function(){

	getCentroid();
	getPotholeData();
	projectData();

	projectCircles(drawCircles())
}
