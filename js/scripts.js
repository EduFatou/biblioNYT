//*********************variables************************************************************************

const section = document.querySelector('#section');
const divList = document.querySelector('#divList');
const fragment = document.createDocumentFragment();
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const main = document.querySelector('#main');
const divCategoriesFilter = document.querySelector('#filter-container');
const filterCategoriesInput = document.querySelector('#filterCategoriesInput');
const divBooksFilter = document.querySelector('#filterBooks-container');
const filterBooksInput = document.querySelector('#filterBooksInput');
const ShowOnly = document.querySelector('#showOnly');
const oldest = document.querySelector('#oldest');
const newest = document.querySelector('#newest');
const show5 = document.querySelector('#show5');
const backButton = document.querySelector('#backButton');
let datalist = document.querySelector('#datalist');
let datalist2 = document.querySelector('#datalist2');
let lists = [];
let filteredLists = [];
let booklist = [];
let listName = '';
let arrayCategoriesSuggestions = [];
let arrayBookSuggestions = [];
let currentPage = 0;
let pages = [];
const nextButton = document.createElement('button');
const previousButton = document.createElement('button');
nextButton.innerHTML = 'Next page';
previousButton.innerHTML = 'Previous page';
nextButton.setAttribute('id', 'next');
previousButton.setAttribute('id', 'previous');


//*********************events************************************************************************


//all buttons

document.addEventListener('click', (evento) => {

    //main

    if (evento.target.matches('.listButton')) {
        const category = evento.target.id;
        getBooklist(category);
        filterCategoriesInput.value = '';
    }
    if (evento.target.matches('#backButton')) {
        clear(divList);
        divCategoriesFilter.style.display = 'block';
        divBooksFilter.style.display = 'none';
        backButton.style.display = 'none';
        nextButton.style.display = 'none';
        previousButton.style.display = 'none';

        getCategories();
        filterCategoriesInput.value = '';
    }
    if (evento.target.matches('#filterButton'))
        searchByCategory();
        
    if (evento.target.matches('#sortByAZ'))
        sortByAlphabet('AZ');

    if (evento.target.matches('#sortByZA'))
        sortByAlphabet('ZA');

    //booklists

    if (evento.target.matches('#filterBooksButton'))
        searchBooks();

    if (evento.target.matches('#sortBooksByAZ'))
        sortBooksByAlphabet('AZ');

    if (evento.target.matches('#sortBooksByZA'))
        sortBooksByAlphabet('ZA');
});

//---------------------index events---------------------------------

//input suggestions, search by category

filterCategoriesInput.onkeyup = (ev) => {
    let input = ev.target.value;
    let filteredSuggestions = [];
    if (input) filteredSuggestions = arrayCategoriesSuggestions.filter(data => {
        return data.toLocaleLowerCase().startsWith(input.toLocaleLowerCase());
    });
    datalist.innerHTML = '';
    filteredSuggestions.forEach((input) => {
        const option = document.createElement('option');
        option.value = input;
        datalist.append(option);
    });
};

//select, show by week or month

ShowOnly.addEventListener('change', (evento) => {
    if (evento.target.value === 'WEEKLY' || evento.target.value === 'MONTHLY')
        showByPeriod(evento.target.value);
    if (evento.target.value === 'everything')
        getCategories();
});

//select, sort by published date

oldest.addEventListener('change', (evento) => {
    if (evento.target.value === 'ascending' || evento.target.value === 'descending')
        sortByOldDate(evento.target.value);
    if (evento.target.value === 'everything')
        getCategories();
});

newest.addEventListener('change', (evento) => {
    if (evento.target.value === 'ascending' || evento.target.value === 'descending')
        sortByNewDate(evento.target.value);
    if (evento.target.value === 'everything')
        getCategories();
});

//enter keypress for filter button
filterCategoriesInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchByCategory();
    }
});


//---------------------Booklists events---------------------------------

//input suggestions, search by title or author

filterBooksInput.onkeyup = (ev) => {
    let input = ev.target.value;
    let filteredSuggestions = [];
    if (input) filteredSuggestions = arrayBookSuggestions.filter(data => {
        return data.toLocaleLowerCase().startsWith(input.toLocaleLowerCase());
    });
    datalist2.innerHTML = '';
    filteredSuggestions.forEach((input) => {
        const option = document.createElement('option');
        option.value = input;
        datalist2.append(option);
    });
};

//show five pages, append buttons

show5.addEventListener('change', (evento) => {
    if (evento.target.checked) {
        for (let i = 0; i < booklist.length; i += 5) {
            pages.push(booklist.slice(i, i + 5));
        }
        header.append(nextButton, previousButton);
        printBooklist(pages[currentPage], listName);
    } else {
        printBooklist(booklist, listName);
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        printBooklist(pages[currentPage], listName);
    }
});

previousButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        printBooklist(pages[currentPage], listName);
    }
});


// enter keypress for filterbutton
filterBooksInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchBooks();
    }
});

//*********************filter functions************************************************************************

const clear = elemento => elemento.innerHTML = '';

//---------------------index filters---------------------------------

const searchByCategory = () => {
    backButton.style.display = 'flex';
    const filterCategoriesValue = filterCategoriesInput.value.toLowerCase();
    filteredLists = lists.filter(lista => lista.display_name.toLowerCase().includes(filterCategoriesValue));
    clear(divList);
    printCategories(filteredLists);
};

const showByPeriod = (period) => {
    backButton.style.display = 'flex';
    const periodfilteredLists = filteredLists.filter(lista => lista.updated === period);
    clear(divList);
    printCategories(periodfilteredLists);
};

const sortByAlphabet = (order) => {
    backButton.style.display = 'flex';
    clear(divList);
    const sortedList = filteredLists.sort((a, b) => {
        if (order === 'AZ') {
            return a.display_name.localeCompare(b.display_name);
        } else if (order === 'ZA') {
            return b.display_name.localeCompare(a.display_name);
        }
    });
    printCategories(sortedList);
};

const sortByOldDate = (oldest) => {
    backButton.style.display = 'flex';
    clear(divList);
    const sortedByOldestDate = filteredLists.sort((a, b) => {
        if (oldest === 'ascending') {
            return a.oldest_published_date.localeCompare(b.oldest_published_date);
        } else if (oldest === 'descending') {
            return b.oldest_published_date.localeCompare(a.oldest_published_date);
        }
    });
    printCategories(sortedByOldestDate);
};

const sortByNewDate = (newest) => {
    backButton.style.display = 'flex';
    clear(divList);
    const sortedByNewestDate = filteredLists.sort((a, b) => {
        if (newest === 'ascending') {
            return a.newest_published_date.localeCompare(b.newest_published_date);
        } else if (newest === 'descending') {
            return b.newest_published_date.localeCompare(a.newest_published_date);
        }
    });
    printCategories(sortedByNewestDate);
};


//---------------------booklist filters-------------------------------------

const searchBooks = () => {
    const filterBooksValue = filterBooksInput.value.toLowerCase();
    const filteredBooklists = booklist.filter(lista => lista.title.toLowerCase().includes(filterBooksValue) || lista.author.toLowerCase().includes(filterBooksValue));
    console.log(filteredBooklists)
    clear(divList);
    printBooklist(filteredBooklists, listName);
    
};

const sortBooksByAlphabet = (order) => {
    clear(divList);
    const sortedList = booklist.sort((a, b) => {
        if (order === 'AZ') {
            return a.title.localeCompare(b.title);
        } else if (order === 'ZA') {
            return b.title.localeCompare(a.title);
        }
    });
    printBooklist(sortedList, listName);
};

//*********************main functions************************************************************************

//---------------------index functions----------------------------------------

const getCategories = async () => {
    header.style.display = 'none';
    divBooksFilter.style.display = 'none';
    backButton.style.display = 'none';
    loader.style.display = 'flex';
    const url = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=fIJzQt26lm7XPd0UdB5iJlFzxefOembt';
    document.getElementById('title').innerHTML = 'Categories';
    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            header.style.display = 'block';
            const data = await respuesta.json();
            lists = data.results;
            filteredLists = [...lists];
            printCategories(lists);
            loader.style.display = 'none';
            return lists;
        } else {
            throw 'Ha habido un problema.';
        }
    } catch (error) {
        throw 'la dirección no existe.';
    }
};

const printCategories = (lists) => {

    lists.forEach((list) => {
        arrayCategoriesSuggestions.push(list.display_name);
    });

    lists.forEach((elemento) => {
        const containerLista = document.createElement('article');
        const tituloLista = document.createElement('h2');
        const barra = document.createElement('hr');
        const oldest = document.createElement('p');
        const newest = document.createElement('p');
        const actualizado = document.createElement('p');
        const listButton = document.createElement('button');
        tituloLista.innerHTML = elemento.display_name;
        oldest.innerHTML = `Oldest: ${elemento.oldest_published_date}`;
        newest.innerHTML = `Newest: ${elemento.newest_published_date}`;
        actualizado.innerHTML = `Updated: ${elemento.updated.toLowerCase()}`;
        listButton.innerHTML = 'READ MORE! >';
        listButton.classList.add('listButton');
        listButton.setAttribute('id', elemento.list_name_encoded);
        containerLista.append(tituloLista, barra, oldest, newest, actualizado, listButton);
        fragment.append(containerLista)
    });
    divList.append(fragment);
};

//---------------------booklist functions----------------------------------------

const getBooklist = async (category) => {
    divBooksFilter.style.display = 'block';
    backButton.style.display = 'flex';
    divCategoriesFilter.style.display = 'none';
    loader.style.display = 'flex';
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/${category}.json?api-key=fIJzQt26lm7XPd0UdB5iJlFzxefOembt`;
    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            divList.innerHTML = '';
            const data = await respuesta.json();
            listName = data.results.display_name;
            booklist = data.results.books;
            printBooklist(booklist, listName);
            loader.style.display = 'none';
            return booklist;

        } else {
            throw 'Ha habido un problema.';
        }
    } catch (error) {
        throw 'la dirección no existe.';
    }
};

const printBooklist = (booklist, listName) => {
    divList.innerHTML = '';
    document.getElementById('title').innerHTML = listName;

    booklist.forEach((book) => {
        arrayBookSuggestions.push(book.title, book.author);
    });

    booklist.forEach((libro) => {
        const containerLista = document.createElement('article');
        const tituloLibro = document.createElement('h3');
        const imagenLibro = document.createElement('img');
        const weeksOnList = document.createElement('p');
        const descripcion = document.createElement('p');
        const botonAmazon = document.createElement('a');
        tituloLibro.innerHTML = `#${libro.rank} ${libro.title}`;
        imagenLibro.src = libro.book_image;
        imagenLibro.alt = libro.title;
        weeksOnList.innerHTML = `<i>Weeks on list: ${libro.weeks_on_list}</i>`;
        descripcion.innerHTML = `${libro.description}<br>`;
        botonAmazon.innerHTML = 'BUY AT AMAZON';
        botonAmazon.setAttribute('href', libro.amazon_product_url);
        botonAmazon.setAttribute('target', '_blank');
        botonAmazon.classList.add('botonAmazon');
        containerLista.append(tituloLibro, imagenLibro, weeksOnList, descripcion, botonAmazon);
        fragment.append(containerLista);
    })
    divList.append(fragment);
};

lists = getCategories()
    .then(respuesta => {
        console.log(respuesta);
        return respuesta;
    })
    .catch(error => console.error(error))


// getBooklist()
//     .then(respuesta => console.log(respuesta))
//     .catch(error => console.error(error))
