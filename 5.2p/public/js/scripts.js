const btn = document.querySelector('#fetchBooksBtn');
const out = document.querySelector('#booksDisplay');

function render(items) {
    console.log('Rendering items:', items);
    out.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
        out.textContent = 'No items';
        return;
    }
    for (const it of items) {
        // Create elements for book details and summary
        const details = document.createElement('p');
        const summary = document.createElement('p');

        details.textContent = `${it.title} by ${it.author} (${it.year}) - ${it.genre}`;

        summary.textContent = it.summary;
        summary.style.fontStyle = 'italic';
        summary.style.marginLeft = '20px';
        
        out.appendChild(details);
        out.appendChild(summary);
    }
}

btn.addEventListener('click', () => {
    out.textContent = 'Loading...';
    fetch('/api/books')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            console.log('Response received:', res);
            return res.json();
        })
        .then(json => {
            console.log('JSON parsed:', json);
            render(json.data);
        })
        .catch(err => {
            console.error('Error fetching books:', err);
            out.textContent = 'Error fetching books.';
        });
});
