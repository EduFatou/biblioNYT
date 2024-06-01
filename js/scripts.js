//variables
const divLista = document.querySelector('#lista');
const fragment = document.createDocumentFragment();
const loader = document.getElementById('centrado');
const hidden = document.querySelector('.hidden');
let containerLista;
let tituloLista;
let botonLista;
//eventos
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        hidden.classList.remove('hidden');
        loader.remove();
    }, 1000);
});

document.addEventListener('click', async (evento) => {
    if (evento.target.matches('.botonLista')) {
        const id = evento.target.getAttribute('id');
        await getSpecifiedList(id);
    }
});

//funciones
const getOverview = async () => {
    const url = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=fIJzQt26lm7XPd0UdB5iJlFzxefOembt';
    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            const data = await respuesta.json();
            const listas = data.results;
            listas.forEach((elemento) => {
                containerLista = document.createElement('article');
                tituloLista = document.createElement('h2');
                tituloLista.innerHTML = elemento.display_name;
                const barra = document.createElement('hr');
                const oldest = document.createElement('p');
                oldest.innerHTML = `Oldest: ${elemento.oldest_published_date}`;
                const newest = document.createElement('p');
                newest.innerHTML = `Newest: ${elemento.newest_published_date}`;
                const actualizado = document.createElement('p');
                actualizado.innerHTML = `Updated: ${elemento.updated.toLowerCase()}`;
                const botonLista = document.createElement('button');
                botonLista.innerHTML = 'READ MORE! >';
                botonLista.classList.add('botonLista');
                botonLista.setAttribute('id', elemento.list_name_encoded);
                console.log(botonLista)
                containerLista.append(tituloLista, barra, oldest, newest, actualizado, botonLista);
                fragment.append(containerLista)
            });
            divLista.append(fragment);

        } else {
            throw 'Ha habido un problema.';
        }
    } catch (error) {
        throw 'la dirección no existe.';
    }
};
getOverview()
    .then((respuesta) => { console.log(respuesta) })
    .catch((error) => { console.error(error) })


const getSpecifiedList = async () => {
    const url = 'https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=fIJzQt26lm7XPd0UdB5iJlFzxefOembt';
    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            divLista.innerHTML = '';
            const data = await respuesta.json();
            const listaLibros = data.results.lists;
            listaLibros.forEach((elemento) => {
                if (elemento.list_name_encoded == id) {
                    elemento.books.forEach((libro) => {
                        containerLista = document.createElement('article');
                        const ranking = libro.rank;
                        const tituloLibro = document.createElement('h3');
                        tituloLibro.innerHTML = `#${libro.rank} ${libro.title}`;
                        const imagenLibro = document.createElement('img');
                        imagenLibro.src = libro.book_image;
                        imagenLibro.alt = libro.title;
                        const weeksOnList = document.createElement('p');
                        weeksOnList.innerHTML = `Weeks on list: ${libro.weeks_on_list}`;
                        const descripcion = document.createElement('p');
                        descripcion.innerHTML = libro.description;
                        const botonBuy = document.createElement('button');
                        botonBuy.innerHTML = libro.amazon_product_url;
                        botonBuy.classList.add('botonAmazon');
                        containerLista.append(tituloLibro, imagenLibro, weeksOnList, descripcion, botonBuy);
                        fragment.append(containerLista);
                    })
                }
            });
            divLista.append(fragment);
        } else {
            throw 'Ha habido un problema.';
        }
    } catch (error) {
        throw 'la dirección no existe.';
    }
};

getSpecifiedList()
    .then((respuesta) => { console.log(respuesta) })
    .catch((error) => { console.error(error) })