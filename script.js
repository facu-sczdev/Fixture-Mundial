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
        alg: "Argelia"
    };

    const inputs = document.querySelectorAll(".match input");

    const datosGuardados = JSON.parse(localStorage.getItem("fixtureMundial"));

if (datosGuardados) {
    inputs.forEach((input, index) => {
        if (datosGuardados[index] !== undefined) {
            input.value = datosGuardados[index];
        }
    });
}

    inputs.forEach((input, index) => {

        input.addEventListener("input", actualizarFixture);

        input.addEventListener("keydown", (e) => {

            if (e.key === "Enter" || e.key === "ArrowRight") {

                e.preventDefault();

                if (inputs[index + 1]) {
                    inputs[index + 1].focus();
                    inputs[index + 1].select();
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

        document.querySelectorAll(".group-wrapped").forEach(grupo => {

            const tabla = {};

            grupo.querySelectorAll(".clasf-teams").forEach(equipo => {

                const nombre = equipo.querySelector(".team-name").textContent.trim();

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

                const localTag = partido.querySelector(".team-1");
                const visitanteTag = partido.querySelector(".team-2");

                if (!localTag || !visitanteTag) return;

                const local = abreviaturas[localTag.textContent.trim()];
                const visitante = abreviaturas[visitanteTag.textContent.trim()];

                if (!tabla[local] || !tabla[visitante]) return;

                const inputsPartido = partido.querySelectorAll("input");

                const golLocal = inputsPartido[0].value;
                const golVisitante = inputsPartido[1].value;

                if (golLocal === "" || golVisitante === "") return;

                const gl = Number(golLocal);
                const gv = Number(golVisitante);

                tabla[local].pj++;
                tabla[visitante].pj++;

                tabla[local].gf += gl;
                tabla[visitante].gf += gv;

                tabla[local].dg += gl - gv;
                tabla[visitante].dg += gv - gl;

                if (gl > gv) {

                    tabla[local].puntos += 3;

                } else if (gv > gl) {

                    tabla[visitante].puntos += 3;

                } else {

                    tabla[local].puntos += 1;
                    tabla[visitante].puntos += 1;
                }
            });

            const ranking = Object.values(tabla);

            ranking.sort((a, b) => {

                if (b.puntos !== a.puntos)
                    return b.puntos - a.puntos;

                if (b.dg !== a.dg)
                    return b.dg - a.dg;

                return b.gf - a.gf;
            });

            const contenedor = grupo.querySelector(".clasf-group");

            ranking.forEach((equipo, posicion) => {

                equipo.elemento.classList.remove(
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

                equipo.elemento.querySelector(".position").textContent =
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