let graph;
let simulation;
let zoom;

function processNotes() {
    const folders = JSON.parse(localStorage.getItem('folders')) || {};
    const nodes = [];
    const links = [];

    Object.entries(folders).forEach(([folderName, notes], folderIndex) => {
        // Add the folder node
        nodes.push({ id: folderName, group: folderIndex + 1, size: 40, type: 'folder' });

        notes.forEach((note, noteIndex) => {
            const noteId = `${folderName}_note_${noteIndex}`;
            // Add the note node
            nodes.push({ id: noteId, group: folderIndex + 1, size: 30, type: 'note', content: note, folder: folderName });
            links.push({ source: folderName, target: noteId });

            // Extract bolded terms using regex (assuming markdown syntax **bolded term**)
            const boldedTerms = note.match(/\*\*(.*?)\*\*/g) || [];
            boldedTerms.forEach(boldedTerm => {
                // Remove the ** from the term
                const cleanTerm = boldedTerm.replace(/\*\*/g, '').toLowerCase();
                const termId = `${folderName}_${cleanTerm}`;

                // Check if the term node already exists
                const existingNode = nodes.find(n => n.id === termId);
                if (existingNode) {
                    existingNode.size += 5;
                } else {
                    // Add the term node
                    nodes.push({ id: termId, group: folderIndex + 1, size: 20, type: 'term', folder: folderName });
                }

                // Create a link from the note to the term
                links.push({ source: noteId, target: termId });
            });
        });
    });

    return { nodes, links };
}



function updateGraph(subject = 'all') {
    const { nodes, links } = processNotes();

    let filteredNodes, filteredLinks;

    if (subject === 'all') {
        filteredNodes = nodes;
        filteredLinks = links;
    } else {
        filteredNodes = nodes.filter(n => n.folder === subject || n.id === subject);
        filteredLinks = links.filter(l => 
            filteredNodes.some(n => n.id === l.source || n.id === l.source.id) && 
            filteredNodes.some(n => n.id === l.target || n.id === l.target.id)
        );
    }

    simulation.nodes(filteredNodes);
    simulation.force('link').links(filteredLinks);

    const link = graph.select('.links').selectAll('.link')
        .data(filteredLinks)
        .join('line')
        .attr('class', 'link')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 2);

    const node = graph.select('.nodes').selectAll('.node')
        .data(filteredNodes)
        .join('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        .on('click', showNodeInfo);

    node.selectAll('circle')
        .data(d => [d])
        .join('circle')
        .attr('r', d => Math.sqrt(d.size) * 2)
        .attr('fill', d => d3.schemeCategory10[d.group]);

    node.selectAll('text')
        .data(d => [d])
        .join('text')
        .attr('dx', 12)
        .attr('dy', '.35em')
        .text(d => d.id.split('_').pop());

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    simulation.alpha(1).restart();
}

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

async function showNodeInfo(event, d) {
const nodeInfo = document.getElementById('nodeInfo');
nodeInfo.style.display = 'block';
let content = `<h3>${d.id}</h3>`;
content += `<p>Type: ${d.type}</p>`;

if (d.type === 'note') {
content += `<p>Content: ${d.content}</p>`;

}


nodeInfo.innerHTML = content;
}




function initializeGraph() {
    const width = window.innerWidth;
    const height = window.innerHeight - 80;

    zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', zoomed);

    graph = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoom);

    const g = graph.append('g');
    g.append('g').attr('class', 'links');
    g.append('g').attr('class', 'nodes');

    simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(width / 2, height / 2));

    updateGraph();

    const folders = JSON.parse(localStorage.getItem('folders')) || {};
    const subjectSelect = document.getElementById('subjectSelect');
    Object.keys(folders).forEach(folder => {
        const option = document.createElement('option');
        option.value = folder;
        option.textContent = folder;
        subjectSelect.appendChild(option);
    });
}

function zoomed(event) {
    graph.select('g').attr('transform', event.transform);
}

window.onload = initializeGraph;
