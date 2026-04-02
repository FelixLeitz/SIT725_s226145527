const btn = document.querySelector('#fetchBooksBtn');
const out = document.querySelector('#booksDisplay');

function renderBooks(items) {
    console.log('Rendering items:', items);
    out.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
        out.textContent = 'No items';
        return;
    }
    for (const it of items) {
        // Create elements for book details
        const details = document.createElement('p');
        const price = it.price?.$numberDecimal ?? it.price ?? '';

        details.textContent = `${it.title} ${price} ${it.currency}`;

        out.appendChild(details);
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
            renderBooks(json.data);
        })
        .catch(err => {
            console.error('Error fetching books:', err);
            out.textContent = 'Error fetching books.';
        });
});
