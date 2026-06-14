document.addEventListener("DOMContentLoaded", () => {

    const abreviaturas = {
        mex: "México",
        cor: "Corea del Sur",
        rsa: "Sudáfrica",
        sfa: "Sudáfrica",
        rpc: "Chequia",

        can: "Canada",
        qat: "Qatar",
        bos: "Bosnia",
        sui: "Suiza",

        bra: "Brasil",
        mar: "Marruecos",
        esc: "Escocia",
        hai: "Haití",

        usa: "Estados Unidos",
        par: "Paraguay",
        aus: "Australia",
        tur: "Turquía",

        ale: "Alemania",
        ecu: "Ecuador",
        cdm: "Costa de Marfil",
        cur: "Curazao",

        pba: "Paises Bajos",
        jap: "Japón",
        sue: "Suecia",
        tun: "Tunez",

        bel: "Bélgica",
        egi: "Egipto",
        ira: "Irán",
        nzl: "Nueva Zelanda",

        esp: "España",
        cab: "Cabo Verde",
        ara: "Arabia Saudita",
        uru: "Uruguay",

        fra: "Francia",
        sen: "Senegal",
        irk: "Irak",
        nor: "Noruega",

        arg: "Argentina",
        aut: "Austria",
        jor: "Jordania",
        alg: "Argelia",

        por:"Portugal",
        col: "Colombia",
        uzb: "Uzbekistan",
        rdc: "RP del Congo",

        ing: "Inglaterra",
        cro: "Croacia",
        gha: "Ghana",
        pan: "Panamá"
    };

    const inputs = document.querySelectorAll(".match input"); /* Guarda los inputs */

    const datosGuardados = JSON.parse(localStorage.getItem("fixtureMundial")); /* Guarda datos al cerrar la página */

if (datosGuardados) {
    inputs.forEach((input, index) => {
        if (datosGuardados[index] !== undefined) {   /* Rellena los inputs con los datos guardados */
            input.value = datosGuardados[index];
        }
    });
}

    inputs.forEach((input, index) => {

        input.addEventListener("input", actualizarFixture);  /* Actualiza el fixture cuando se escribe en un input */

        input.addEventListener("keydown", (e) => {  

            if (e.key === "Enter" || e.key === "ArrowRight") {

                e.preventDefault(); /* Evita el comportamiento por defecto */

                if (inputs[index + 1]) {        /* Si existe un input siguiente */
                    inputs[index + 1].focus(); /* Enfoca el siguiente input */
                    inputs[index + 1].select(); /* Selecciona el contenido del siguiente input */
                }
            }

            if (e.key === "ArrowLeft") {  

                e.preventDefault(); 

                if (inputs[index - 1]) {
                    inputs[index - 1].focus();
                    inputs[index - 1].select();
                }
            }

            if (e.key === "ArrowDown") {

                e.preventDefault();

                if (inputs[index + 2]) {
                    inputs[index + 2].focus();
                    inputs[index + 2].select();
                }
            }

            if (e.key === "ArrowUp") {

                e.preventDefault();

                if (inputs[index - 2]) {
                    inputs[index - 2].focus();
                    inputs[index - 2].select();
                }
            }
        });

    });

    actualizarFixture();

    function actualizarFixture() {

        const datos = [];

document.querySelectorAll(".match input").forEach(input => {
    datos.push(input.value);
});

localStorage.setItem("fixtureMundial", JSON.stringify(datos));

        document.querySelectorAll(".group-wrapped").forEach(grupo => { /* Recorre todos los grupos */

            const tabla = {};

            grupo.querySelectorAll(".clasf-teams").forEach(equipo => { /* Recorre todos los equipos de un grupo */

                const nombre = equipo.querySelector(".team-name").textContent.trim(); /* Obtiene el nombre del equipo */

                tabla[nombre] = {
                    nombre,
                    puntos: 0,           
                    pj: 0,
                    dg: 0,
                    gf: 0,
                    elemento: equipo  
                };
            });

            grupo.querySelectorAll(".match").forEach(partido => {

                const localTag = partido.querySelector(".team-1"); /* Obtiene la etiqueta del equipo local */
                const visitanteTag = partido.querySelector(".team-2"); /* Obtiene la etiqueta del equipo visitante */

                if (!localTag || !visitanteTag) return; /* Si no existen las etiquetas, se omite el partido */

                const local = abreviaturas[localTag.textContent.trim()]; /* Obtiene la abreviatura del equipo local */
                const visitante = abreviaturas[visitanteTag.textContent.trim()];

                if (!tabla[local] || !tabla[visitante]) return;

                const inputsPartido = partido.querySelectorAll("input");

                const golLocal = inputsPartido[0].value;
                const golVisitante = inputsPartido[1].value;

                if (golLocal === "" || golVisitante === "") return;

                const gl = Number(golLocal); /* Convierte el valor del gol local a número */
                const gv = Number(golVisitante);

                tabla[local].pj++; /* Incrementa el número de partidos jugados del equipo local */
                tabla[visitante].pj++;

                tabla[local].gf += gl;
                tabla[visitante].gf += gv;

                tabla[local].dg += gl - gv; /* Incrementa la diferencia de goles del equipo local */
                tabla[visitante].dg += gv - gl;

                if (gl > gv) {

                    tabla[local].puntos += 3;

                } else if (gv > gl) {

                    tabla[visitante].puntos += 3;

                } else {

                    tabla[local].puntos += 1;
                    tabla[visitante].puntos += 1;
                }
                                console.log(local, visitante);

            });

                        console.log("Grupo:", grupo.querySelector(".group").textContent);


            const ranking = Object.values(tabla); /* Obtiene un array con todos los equipos y sus estadísticas */

            
            ranking.sort((a, b) => { /* Ordena los equipos por puntos, diferencia de goles y goles a favor */

                if (b.puntos !== a.puntos) /* Si los puntos son diferentes, ordena por puntos */
                    return b.puntos - a.puntos; /* devuelve la diferencia de puntos */

                if (b.dg !== a.dg) /* Si la diferencia de goles es diferente, ordena por diferencia de goles */
                    return b.dg - a.dg;

                return b.gf - a.gf;
            });

            const contenedor = grupo.querySelector(".clasf-group"); /* Obtiene el contenedor del grupo de clasificación */

            ranking.forEach((equipo, posicion) => { /* Recorre el array de equipos ordenados */

                equipo.elemento.classList.remove( /* Elimina las clases de estado del equipo */
                    "clasificado",
                    "repechaje",
                    "eliminado"
                );

                if (posicion <= 1) {
                    equipo.elemento.classList.add("clasificado"); 
                }
                else if (posicion === 2) {
                    equipo.elemento.classList.add("repechaje");
                }
                else {
                    equipo.elemento.classList.add("eliminado");
                }

                equipo.elemento.querySelector(".position").textContent = /* Actualiza la posición del equipo */
                    posicion + 1;

                equipo.elemento.querySelector(".points").textContent =
                    equipo.puntos;

                equipo.elemento.querySelector(".matches-played").textContent =
                    equipo.pj;

                equipo.elemento.querySelector(".difference").textContent =
                    equipo.dg;

                contenedor.appendChild(equipo.elemento);
            });
        });
    }
});