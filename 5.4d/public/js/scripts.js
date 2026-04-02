const btn = document.querySelector('#fetchBooksBtn');
const displayOut = document.querySelector('#booksDisplay');
const detailsOut = document.querySelector('#bookDetails');

function renderBooks(items) {
    console.log('Rendering items:', items);
    displayOut.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
        displayOut.textContent = 'No items';
        return;
    }
    for (const it of items) {
        // Create elements for book details
        const details = document.createElement('p');
        const price = it.price?.$numberDecimal ?? it.price ?? '';

        // Format the text content with title, price, and currency
        details.textContent = `${it.title} ${price} ${it.currency}`;

        // Add event listener to show more details on click
        details.addEventListener('click', () => handleBookClick(it));

        displayOut.appendChild(details);
    }
}

function handleBookClick(book) {
    fetch(`/api/books/${book.id}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(json => {
            const b = json.data;
            const price = b.price?.$numberDecimal ?? b.price ?? '';
            detailsOut.innerHTML = `
                <strong>Title:</strong> ${b.title}<br>
                <strong>Author:</strong> ${b.author}<br>
                <strong>Year:</strong> ${b.year}<br>
                <strong>Genre:</strong> ${b.genre}<br>
                <strong>Summary:</strong> ${b.summary}<br>
                <strong>Price:</strong> ${price} ${b.currency}
            `;
        })
        .catch(err => {
            console.error('Error fetching book:', err);
            detailsOut.textContent = 'Error fetching book details.';
        });
}

btn.addEventListener('click', () => {
    displayOut.textContent = 'Loading...';
    detailsOut.textContent = '';
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
            displayOut.textContent = 'Error fetching books.';
        });
});
