
/**
 * Ejercicio 1: Buscar y mostrar información del Pokemon con FETCH
 */
/**
 * Función para buscar pokemon ejercicio 1 y 2.
 * 
*/

document.getElementById('search-btn').addEventListener('click', buscarPokemon);

function buscarPokemon() {
    const pokemonBuscado=document.getElementById('pokemon-input').value.toLowerCase().trim();
    const resultSection=document.getElementById('result-section');
    const pokemonInfo=document.getElementById('pokemon-data');

    //Limpiar resultados anteriores
    pokemonInfo.innerHTML='';

    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonBuscado)
        .then(response => {
            if (!response.ok) {
                alert('Pokémon no encontrado');
            }
            return response.json();
        })
        .then(pokemon => {
            resultSection.classList.remove('hidden');

            // Tipos
            let tipos = '';
            for (let i = 0; i < pokemon.types.length; i++) {
                tipos += pokemon.types[i].type.name;
                if (i < pokemon.types.length - 1) tipos += ', ';
            }

            // Habilidades
            let habilidades = '';
            for (let i = 0; i < pokemon.abilities.length; i++) {
                habilidades += pokemon.abilities[i].ability.name;
                if (i < pokemon.abilities.length - 1) habilidades += ', ';
            }

            // Stats
            let stats = '';
            for (let i = 0; i < pokemon.stats.length; i++) {
                stats+='<li>'+pokemon.stats[i].stat.name+': '+pokemon.stats[i].base_stat+'</li>';
            }

            // Mostrar información completa
            pokemonInfo.innerHTML=
                "<h3>"+pokemon.name+"(ID: "+pokemon.id+")</h3>"+
                "<img src='"+pokemon.sprites.front_default+"' alt='"+pokemon.name+"'>"+
                "<img src='"+pokemon.sprites.front_shiny+"' alt='"+pokemon.name+" trasero'>"+
                "<p><strong>Tipo:</strong>"+tipos+"</p>"+
                "<p><strong>Habilidades:</strong>"+habilidades+"</p>"+
                "<h4>Estadísticas:</h4>"+
                "<ul>"+stats+"</ul>"+
                "<p><strong>Altura:</strong>"+(pokemon.height/10)+" m</p>"+
                "<p><strong>Peso:</strong> "+(pokemon.weight/10)+" kg</p>"+
                "<button id='add-to-collection-btn'>Agregar a la colección</button>";
            mostrarEvoluciones(pokemon.name);
            document.getElementById('add-to-collection-btn').addEventListener('click', function() {
                agregarAColeccion(pokemon.name, pokemon.sprites.front_default);
            });
        })
        .catch(error => {
            resultSection.classList.remove('hidden');
            pokemonInfo.innerHTML = "<p>" + error.message + "</p>";
        });
}

function mostrarEvoluciones(pokemonName) {
    const evoSection = document.getElementById('evo-section');
    const evoDiv = document.getElementById('pokemon-evo');

    evoDiv.innerHTML = ''; // Limpiar resultados anteriores

    fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokemonName)
        .then(res => {
            if (!res.ok) throw new Error("No se encontró la especie del Pokémon");
            return res.json();
        })
        .then(speciesData => fetch(speciesData.evolution_chain.url))
        .then(res => {
            if (!res.ok) throw new Error("No se pudo obtener la cadena de evoluciones");
            return res.json();
        })
        .then(evoData => {

            function recorrerEvoluciones(nodo) {
                //Crear el div de la evolución
                const div = document.createElement('div');
                div.style.display = 'inline-block';
                div.style.margin = '10px';
                div.style.textAlign = 'center';
                div.innerHTML = "<p>" + nodo.species.name + "</p>";
                evoDiv.appendChild(div);

                //Pedir info de la imagen
                fetch("https://pokeapi.co/api/v2/pokemon/" + nodo.species.name)
                    .then(res => res.json())
                    .then(pokemon => {
                        div.innerHTML = "<img src='" + pokemon.sprites.front_default + "' alt='" + pokemon.name + "'>" +
                                        "<p>" + pokemon.name + "</p>";
                    });

                //Recorrer todas las evoluciones siguientes (todas las ramas)
                nodo.evolves_to.forEach(siguiente => recorrerEvoluciones(siguiente));
            }

            recorrerEvoluciones(evoData.chain);
            evoSection.classList.remove('hidden');
        })
        .catch(error => {
            evoSection.classList.remove('hidden');
            evoDiv.innerHTML = "<p>" + error.message + "</p>";
        });
}


/**
 * Ejercicio 3: buscar pokemon con JQuery AJAX.
 */

function buscarPokemonJQueryAJAX() {
    const pokemonBuscado = $('#pokemon-input').val().toLowerCase().trim();
    const resultSection = $('#result-section');
    const pokemonInfo = $('#pokemon-data');

    // Limpiar resultados anteriores
    pokemonInfo.html('');

    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + pokemonBuscado,
        method: "GET",
        success: function(pokemon) {

            resultSection.removeClass('hidden');

            // Tipos
            let tipos = '';
            for (let i = 0; i < pokemon.types.length; i++) {
                tipos += pokemon.types[i].type.name;
                if (i < pokemon.types.length - 1) tipos += ', ';
            }

            // Habilidades
            let habilidades = '';
            for (let i = 0; i < pokemon.abilities.length; i++) {
                habilidades += pokemon.abilities[i].ability.name;
                if (i < pokemon.abilities.length - 1) habilidades += ', ';
            }

            // Stats
            let stats = '';
            for (let i = 0; i < pokemon.stats.length; i++) {
                stats += "<li>" + pokemon.stats[i].stat.name + ": " + pokemon.stats[i].base_stat + "</li>";
            }

            // Mostrar información
            pokemonInfo.html(
                "<h3>" + pokemon.name + " (ID: " + pokemon.id + ")</h3>" +
                "<img src='" + pokemon.sprites.front_default + "' alt='" + pokemon.name + "'>" +
                "<img src='" + pokemon.sprites.front_shiny + "' alt='" + pokemon.name + " shiny'>" +
                "<p><strong>Tipo:</strong> " + tipos + "</p>" +
                "<p><strong>Habilidades:</strong> " + habilidades + "</p>" +
                "<h4>Estadísticas:</h4>" +
                "<ul>" + stats + "</ul>" +
                "<p><strong>Altura:</strong> " + (pokemon.height / 10) + " m</p>" +
                "<p><strong>Peso:</strong> " + (pokemon.weight / 10) + " kg</p>" +
                "<button id='add-to-collection-btn'>Agregar a la colección</button>"
            );

            $('#add-to-collection-btn').on('click', function() {
                agregarAColeccion(pokemon.name, pokemon.sprites.front_default);
            });

            // Evoluciones (reutilizamos tu función)
            mostrarEvoluciones(pokemon.name);
        },
        error: function() {
            resultSection.removeClass('hidden');
            pokemonInfo.html("<p>Pokémon no encontrado</p>");
        }
    });
}

/**
 * Haciendo uso de JQuery, descomentar para usar la función buscarPokemonJQueryAJAX
*/

/*$(document).ready(function(){
    $('#search-btn').on('click', buscarPokemonJQueryAJAX);
});*/ 


let coleccionPokemon = [];

function agregarAColeccion(nombre, sprite) {

    // Evitar duplicados
    for (let i = 0; i < coleccionPokemon.length; i++) {
        if (coleccionPokemon[i].nombre === nombre) {
            alert("Este Pokémon ya está en tu colección");
            return;
        }
    }

    coleccionPokemon.push({
        nombre: nombre,
        sprite: sprite
    });

    alert(nombre + " agregado a la colección");
}

document.getElementById('view-collection-btn').addEventListener('click', mostrarColeccion);

function mostrarColeccion() {
    const collectionSection = document.getElementById('collection-section');
    const collectionList = document.getElementById('collection-list');

    collectionList.innerHTML = '';

    if (coleccionPokemon.length === 0) {
        collectionList.innerHTML = "<p>No has capturado ningún Pokémon</p>";
    } else {
        for (let i = 0; i < coleccionPokemon.length; i++) {
            collectionList.innerHTML +=
                "<div class='collection-item'>" +
                "<img src='" + coleccionPokemon[i].sprite + "' alt='" + coleccionPokemon[i].nombre + "'>" +
                "<p>" + coleccionPokemon[i].nombre + "</p>" +
                "</div>";
        }
    }

    collectionSection.classList.remove('hidden');
}
