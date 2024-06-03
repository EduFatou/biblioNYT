//variables
const divLista = document.querySelector('#lista');
const fragment = document.createDocumentFragment();
const loader = document.getElementById('loader');
const hidden = document.querySelector('.hidden');
const header = document.getElementById('header');
let botonVolver;


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
        limpiar(divLista);
        //limpiar barra hr???
        await getSpecifiedList(id);
    }
    if (evento.target.matches('.botonVolver')){
        limpiar(divLista);
        botonVolver.remove();
        await getOverview();
    }
});

//funciones
const limpiar = (elemento)=> {
    elemento.innerHTML = '';
}
const getOverview = async () => {
    const url = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=fIJzQt26lm7XPd0UdB5iJlFzxefOembt';
    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            const data = await respuesta.json();
            const listas = data.results;
            listas.forEach((elemento) => {
                const containerLista = document.createElement('article');
                const tituloLista = document.createElement('h2');
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


const getSpecifiedList = async (id) => {
    const url = 'https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=fIJzQt26lm7XPd0UdB5iJlFzxefOembt';
    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            const data = await respuesta.json();
            const listaLibros = data.results.lists;
            listaLibros.forEach((elemento) => {
                if (elemento.list_name_encoded == id) {
                    // const subtitulo = document.createElement('h2'); donde va el subtitulo???
                    // subtitulo.innerHTML = elemento.display_name;
                    elemento.books.forEach((libro) => {
                        const containerLista = document.createElement('article');
                        const ranking = libro.rank;
                        const tituloLibro = document.createElement('h3');
                        tituloLibro.innerHTML = `#${libro.rank} ${libro.title}`;
                        const imagenLibro = document.createElement('img');
                        imagenLibro.src = libro.book_image;
                        imagenLibro.alt = libro.title;
                        const weeksOnList = document.createElement('p');
                        weeksOnList.innerHTML = `<i>Weeks on list: ${libro.weeks_on_list}</i>`;
                        const br = document.createElement('br');
                        const descripcion = document.createElement('p');
                        descripcion.innerHTML = `${libro.description}<br>`;
                        const botonAmazon = document.createElement('button');
                        botonAmazon.innerHTML = 'BUY AT AMAZON';
                        botonAmazon.setAttribute('href', libro.amazon_product_url);
                        botonAmazon.setAttribute('target', '_blank');
                        botonAmazon.classList.add('botonAmazon');
                        containerLista.append(tituloLibro, imagenLibro, weeksOnList, br, descripcion, botonAmazon);
                        fragment.append(containerLista);
                    })
                }
            });
            const barra = document.createElement('hr');
            botonVolver = document.createElement('button');
            botonVolver.innerHTML = '< Back to Index';
            botonVolver.classList.add('botonVolver');
            header.append(barra, botonVolver);
            divLista.append(fragment);
            
        } else {
            throw 'Ha habido un problema.';
        }
    } catch (error) {
        throw 'la dirección no existe.';
    }
};

getSpecifiedList(id)
    .then((respuesta) => { console.log(respuesta) })
    .catch((error) => { console.error(error) })



