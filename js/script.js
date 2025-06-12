document.addEventListener('DOMContentLoaded', function () {

    // Export JSON data
    const exportJSON = () => {
        const a = Object.assign(document.createElement('a'), {
            href: `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(submarineData, null, 2))}`,
            download: 'submarine_data.json'
        });
        a.click();
    };

    // Create main container
    const container = d3.select("body")
        .append("div")
        .attr("class", "container");

    // Create header
    container.append("div")
        .attr("class", "header")
        .append("h1")
        .text("Submarine Visualizer");

    // Create visualization area
    const visualizationDiv = container.append("div")
        .attr("class", "sea")
        .attr("id", "visualization");

    // Create tooltip div
    container.append("div")
        .attr("id", "tooltip");

    // Create instructions section
    const instructionsDiv = container.append("div")
        .attr("class", "instructions");

    instructionsDiv.append("h3")
        .text("Instructions");

    instructionsDiv.append("p")
        .text("Each submarine represents a data case with 5 variables:");

    const list = instructionsDiv.append("ul");
    list.append("li").html("<strong>Depth</strong>: Vertical position of the submarine");
    list.append("li").html("<strong>Length</strong>: Horizontal size of the submarine");
    list.append("li").html("<strong>Tower Height</strong>: Size of the tower above the body");
    list.append("li").html("<strong>Body Width</strong>: Vertical thickness of the body");
    list.append("li").html("<strong>Periscope Radius</strong>: Size of the periscope");

    instructionsDiv.append("p")
        .text("Click on a submarine to select it (it will turn white). Click on another submarine to exchange variable values between the two submarines.");

    // Create export button
    container.append("button")
        .attr("class", "btn")
        .text("Export JSON Data")
        .on("click", exportJSON);

    // Create the SVG element first to get its dimensions
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Visualization configuration
    const width = document.getElementById('visualization').clientWidth;
    const height = document.getElementById('visualization').clientHeight;

    // Update SVG dimensions if needed
    svg.attr("width", width)
        .attr("height", height);

    // Define ranges for the data variables
    const lengthRange = [50, 150];  // Min and max submarine length
    const towerHeightRange = [10, 40];  // Min and max tower height
    const bodyHeightRange = [15, 45];  // Min and max body height
    const periscopeRadiusRange = [2, 8];  // Min and max periscope radius

    // Calculate maximum possible submarine dimensions
    const maxSubmarineLength = lengthRange[1];
    const maxBodyHeight = bodyHeightRange[1];
    const maxTowerHeight = towerHeightRange[1];
    const maxPeriscopeHeight = periscopeRadiusRange[1] * 5; // Periscope is 5 times its radius in height

    // Calculate maximum total height (body height/2 + tower + periscope)
    const maxTotalHeight = (maxBodyHeight / 2) + maxTowerHeight + maxPeriscopeHeight;

    // Set margins equal to max submarine dimensions
    const margin = {
        top: maxTotalHeight,
        right: maxSubmarineLength,
        bottom: maxBodyHeight / 2, // Only half body below center
        left: maxSubmarineLength
    };

    // Define scales for each variable
    const depthScale = d3.scaleLinear()
        .domain([0, 100])  // Using a fixed range for depth
        .range([margin.top, height - margin.bottom]);

    const lengthScale = d3.scaleLinear()
        .domain([0, 100])  // Using a standardized domain for all variables
        .range(lengthRange);

    const towerHeightScale = d3.scaleLinear()
        .domain([0, 100])
        .range(towerHeightRange);

    const bodyHeightScale = d3.scaleLinear()
        .domain([0, 100])
        .range(bodyHeightRange);

    const periscopeRadiusScale = d3.scaleLinear()
        .domain([0, 100])
        .range(periscopeRadiusRange);

    // Multivariate data generation (10 data-cases with 5 variables each)
    const generateMultivariateData = () => {
        const colors = 
            ["red", "orange", "yellow", "green", "blue", 
            "cyan", "purple", "pink", "brown", "beige"];

        const availableWidth = width - margin.left - margin.right;
        
        return Array.from({length: 10}, (_, i) => ({
            id: i,
            x: margin.left + (i * availableWidth / 9) + (Math.random() - 0.5) * 20, // Even spacing + small random offset
            depth: Math.random() * 100,
            length: Math.random() * 100,
            towerHeight: Math.random() * 100,
            bodyHeight: Math.random() * 100,
            periscopeRadius: Math.random() * 100,
            color: colors[i]
        }));
    };

    // Create the JSON data with random positions
    const submarineData = generateMultivariateData();
    console.log("Generated JSON data:", JSON.stringify(submarineData, null, 2));

    // Function to draw a submarine
    function drawSubmarine(d) {
        const x = d.x; // Use directly the x position from data
        const y = depthScale(d.depth);
        const length = lengthScale(d.length);
        const bodyHeight = bodyHeightScale(d.bodyHeight);
        const towerHeight = towerHeightScale(d.towerHeight);
        const periscopeRadius = periscopeRadiusScale(d.periscopeRadius);

        // Group for the submarine
        const submarine = svg.append("g")
            .attr("class", "submarine")
            .attr("id", `submarine-${d.id}`)
            .attr("data-id", d.id)
            .attr("transform", `translate(${x}, ${y})`)
            .style("cursor", "pointer");

        // Submarine body (ellipse)
        submarine.append("ellipse")
            .attr("rx", length / 2)
            .attr("ry", bodyHeight / 2)
            .attr("fill", d.color)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Tower (rounded rectangle)
        submarine.append("rect")
            .attr("x", -length / 6)
            .attr("y", -bodyHeight / 2 - towerHeight)
            .attr("width", length / 3)
            .attr("height", towerHeight)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("fill", d.color)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Periscope (line)
        submarine.append("line")
            .attr("x1", 0)
            .attr("y1", -bodyHeight / 2 - towerHeight)
            .attr("x2", 0)
            .attr("y2", -bodyHeight / 2 - towerHeight - periscopeRadius * 5)
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        // Periscope top (circle)
        submarine.append("circle")
            .attr("cx", 0)
            .attr("cy", -bodyHeight / 2 - towerHeight - periscopeRadius * 5)
            .attr("r", periscopeRadius)
            .attr("fill", d.color)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        return submarine;
    }

    // Variable to track the selected submarine
    let selectedSubmarine = null;

    // Function to update a submarine with new data (with animation)
    function updateSubmarine(submarine, newData, duration = 1000) {
        const x = newData.x; // Use directly the x property from the data
        const y = depthScale(newData.depth);
        const length = lengthScale(newData.length);
        const bodyHeight = bodyHeightScale(newData.bodyHeight);
        const towerHeight = towerHeightScale(newData.towerHeight);
        const periscopeRadius = periscopeRadiusScale(newData.periscopeRadius);

        // Animate submarine position
        submarine.transition()
            .duration(duration)
            .attr("transform", `translate(${x}, ${y})`);

        // Animate body
        submarine.select("ellipse")
            .transition()
            .duration(duration)
            .attr("rx", length / 2)
            .attr("ry", bodyHeight / 2)
            .attr("fill", newData.color);

        // Animate tower
        submarine.select("rect")
            .transition()
            .duration(duration)
            .attr("x", -length / 6)
            .attr("y", -bodyHeight / 2 - towerHeight)
            .attr("width", length / 3)
            .attr("height", towerHeight)
            .attr("fill", newData.color);

        // Animate periscope (line)
        submarine.select("line")
            .transition()
            .duration(duration)
            .attr("y1", -bodyHeight / 2 - towerHeight)
            .attr("y2", -bodyHeight / 2 - towerHeight - periscopeRadius * 5);

        // Animate periscope top
        submarine.select("circle")
            .transition()
            .duration(duration)
            .attr("cy", -bodyHeight / 2 - towerHeight - periscopeRadius * 5)
            .attr("r", periscopeRadius)
            .attr("fill", newData.color);

    }

    // Function to swap values between two submarines
    function swapSubmarineValues(sub1, sub2) {
        const data1 = submarineData.find(d => d.id === +sub1.attr("data-id"));
        const data2 = submarineData.find(d => d.id === +sub2.attr("data-id"));

        // Swap all values except x position using destructuring
        [data1.depth, data2.depth] = [data2.depth, data1.depth];
        [data1.length, data2.length] = [data2.length, data1.length];
        [data1.towerHeight, data2.towerHeight] = [data2.towerHeight, data1.towerHeight];
        [data1.bodyHeight, data2.bodyHeight] = [data2.bodyHeight, data1.bodyHeight];
        [data1.periscopeRadius, data2.periscopeRadius] = [data2.periscopeRadius, data1.periscopeRadius];

        updateSubmarine(sub1, data1);
        updateSubmarine(sub2, data2);

        setTimeout(() => {
            data1.color = submarineData[data1.id].color;
            data2.color = submarineData[data2.id].color;
            updateSubmarine(sub1, data1, 500);
            updateSubmarine(sub2, data2, 500);
            selectedSubmarine = null;
        }, 1000);
    }

    // Function to handle submarine click
    function handleSubmarineClick(d, submarine) {
        const id = +submarine.attr("data-id");
        const data = submarineData.find(item => item.id === id);

        if (!selectedSubmarine) {
            selectedSubmarine = submarine;
            data.color = "white";
            updateSubmarine(submarine, data, 300);
        } else if (selectedSubmarine.attr("data-id") !== submarine.attr("data-id")) {
            swapSubmarineValues(selectedSubmarine, submarine);
        } else {
            data.color = submarineData[id].color;
            updateSubmarine(submarine, data, 300);
            selectedSubmarine = null;
        }
    }

    // Tooltip handler (show/hide based on event type)
    function tooltipHandler(event, d) {
        const id = +d3.select(this).attr("data-id");
        const data = submarineData.find(item => item.id === id);
        const tooltip = d3.select("#tooltip");
        if (event.type === "mouseover") {
            tooltip.html(`
                <strong>Submarine #${id + 1}</strong><br>
                Depth: ${data.depth.toFixed(1)}<br>
                Length: ${data.length.toFixed(1)}<br>
                Tower Height: ${data.towerHeight.toFixed(1)}<br>
                Body Width: ${data.bodyHeight.toFixed(1)}<br>
                Periscope Radius: ${data.periscopeRadius.toFixed(1)}
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("opacity", 1);
        } else {
            tooltip.style("opacity", 0);
        }
    }

    // Draw all initial submarines
    submarineData.forEach(d => {
        drawSubmarine(d)
            .on("click", (event) => handleSubmarineClick(d, d3.select(event.currentTarget)))
            .on("mouseover mouseout", tooltipHandler);
    });
});