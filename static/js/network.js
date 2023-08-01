// network.js

// Create the concentric layout using D3.js
const width = 1200;
const height = 600;
const radius = 200;

const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const centerX = width / 2;
const centerY = height / 2;

// Fetch data from the JSON file
console.log("Fetching data...");
fetch("/static/data/mongo-king-bachman-cleaned2.json")
  .then(response => response.json())
  .then(data => {
    console.log("Data loaded:", data); // Debugging statement

    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error("Data is not an array.");
      return; // Exit the function to prevent further execution
    }

    // Process the loaded data and create nodes and links
    const authorNodes = [];
    const bookNodes = [];
    const authorBookMap = {};

    data.forEach(book => {
      // Skip the book if authors are not present
      if (!book.volumeInfo.hasOwnProperty("authors") || !Array.isArray(book.volumeInfo.authors) || book.volumeInfo.authors.length === 0) {
        return;
      }

      // Process multiple authors for each book
      book.volumeInfo.authors.forEach(author => {
        // Check if the author node already exists
        const authorIndex = authorNodes.findIndex(node => node.name === author);
        if (authorIndex === -1) {
          authorNodes.push({
            name: author,
            x: centerX,
            y: centerY,
            type: "author"
          });
          // Create an empty array for the author's books
          authorBookMap[author] = [];
        }

        // Add the book to the author's books
        authorBookMap[author].push(book);
      });

      // Create a single book node for the book with multiple authors
      bookNodes.push({
        name: book.volumeInfo.title,
        authors: book.volumeInfo.authors, // Store the book's authors
        x: centerX + radius * Math.cos((bookNodes.length / data.length) * 2 * Math.PI),
        y: centerY + radius * Math.sin((bookNodes.length / data.length) * 2 * Math.PI),
        type: "book"
      });
    });

    const nodes = authorNodes.concat(bookNodes);

    const links = [];
    bookNodes.forEach((bookNode, index) => {
      // Connect the book node to each of its authors
      bookNode.authors.forEach(author => {
        const authorIndex = authorNodes.findIndex(node => node.name === author);
        if (authorIndex !== -1) {
          links.push({ source: index + authorNodes.length, target: authorIndex });
        }
      });
    });

    const link = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke", "#ccc")
      .style("stroke-width", 1);

    const node = svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", d => "node " + d.type)
      .attr("r", 5)
      .style("fill", d => (d.type === "author" ? "blue" : "green"));

    node.append("title").text(d => d.name);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d, i) => i).distance(100))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(centerX, centerY))
      .on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });
      
    // Enable panning
    cy.panningEnabled(true);
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });
