//*********************variables*******************************

const section = document.querySelector('#section');
const divList = document.querySelector('#divList');
const fragment = document.createDocumentFragment();
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const main = document.querySelector('#main');
const divFilter = document.querySelector('#filter-container');
const filterInput = document.querySelector('#filterInput');
const ShowOnly = document.querySelector('#showOnly')
let dataList = document.querySelector('#datalist');
let backButton;
let lists = [];
let filteredLists = [];
let arraySuggestions = [];

//*********************events*******************************

//buttons
document.addEventListener('click', (evento) => {
    if (evento.target.matches('.listButton')) {
        const category = evento.target.id;
        getBooklist(category);
        filterInput.value = '';
    }
    if (evento.target.matches('.backButton')) {
        clean(divList);
        backButton.remove();
        getCategories();
        filterInput.value = '';
    }
    if (evento.target.matches('#filterButton')) {
        searchByCategory();
        filterInput.value = '';
    }
    if (evento.target.matches('#sortByAZ'))
        sortByAlphabet('AZ');

    if (evento.target.matches('#sortByZA'))
        sortByAlphabet('ZA');
});

//select, show by week or month
ShowOnly.addEventListener('change', (evento) => {
    if (evento.target.value === 'WEEKLY' || evento.target.value === 'MONTHLY')
        showByPeriod(evento.target.value);
    if (evento.target.value === 'everything')
        getCategories();
});

//input, search by category
filterInput.onkeyup = (ev) => {
    let input = ev.target.value;
    let filteredSuggestions = [];
    if (input) filteredSuggestions = arraySuggestions.filter(data => {
        return data.toLocaleLowerCase().startsWith(input.toLocaleLowerCase());
    });
    dataList.innerHTML = '';
    filteredSuggestions.forEach((input) => {
        const option = document.createElement('option');
        option.value = input;
        dataList.append(option);
    });
};

//*********************functions*******************************

const clean = elemento => elemento.innerHTML = '';

//filters
const searchByCategory = () => {
    const filterValue = filterInput.value.toLowerCase();
    filteredLists = lists.filter(lista => lista.display_name.toLowerCase().includes(filterValue));
    clean(divList);
    printCategories(filteredLists);
};

const showByPeriod = (period) => {
    periodfilteredLists = filteredLists.filter(lista => lista.updated === period);
    clean(divList);
    printCategories(periodfilteredLists);
};

const sortByAlphabet = (order) => {
    clean(divList);
    const sortedList = filteredLists.sort((a, b) => {
        if(order === 'AZ'){
            return a.display_name.localeCompare(b.display_name);
        } else if (order === 'ZA') {
            return b.display_name.localeCompare(a.display_name);
        }
    });
    printCategories(sortedList);
};


//index
const getCategories = async () => {
    loader.style.display = 'flex';
    const url = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=fIJzQt26lm7XPd0UdB5iJlFzxefOembt';
    document.getElementById('title').innerHTML = 'Categories';
    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
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
        arraySuggestions.push(list.display_name);
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

//funcion de lista de libros
const getBooklist = async (category) => {
    loader.style.display = 'flex';
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/${category}.json?api-key=fIJzQt26lm7XPd0UdB5iJlFzxefOembt`;
    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            divList.innerHTML = '';
            const data = await respuesta.json();
            const listName = data.results;
            const booklist = data.results.books;
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
    backButton = document.createElement('button');
    backButton.innerHTML = '< Back to Index';
    backButton.classList.add('backButton');
    header.append(backButton);
    document.getElementById('title').innerHTML = listName.display_name;

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

console.log(lists);
// getBooklist()
//     .then(respuesta => console.log(respuesta))
//     .catch(error => console.error(error))
