import { buscarProposta } from "./storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return alert("ID não encontrado");

  const dados = await buscarProposta(id);
  if (!dados) return alert("Proposta não encontrada");

  const setText = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v || "";
  };

  const setImg = (id, url) => {
    const img = document.getElementById(id);
    if (img && url) img.src = url;
  };

  /* SLIDE 1 */
  setImg("imgSlide1.jpg.png", dados.foto01);
  setText("destinoCampo", dados.destino);
  setText("mesAnoCampo", dados.mesAno);

  /* PÁGINA 2 */
  setText("chegadaCampo", dados.chegada);
  setText("trasladoCampo", dados.traslado);
  setImg("imgFoto01", dados.foto01);
  setImg("imgFoto02", dados.foto02);
  setImg("imgFoto03", dados.foto03);

  /* HOTEL */
  setText("tituloHospedagemCampo", dados.tituloHospedagemCampo);
  setText("hotelCheckinCampo", dados.hotelCheckinCampo);
  setText("hotelCheckoutCampo", dados.hotelCheckoutCampo);
  setText("descricaoCampo", dados.descricaoCampo);
  setText("hotelServicosCampo", dados.hotelServicosCampo);
  setText("enderecoCampo", dados.enderecoCampo);

  /* CARROSSEL HOTEL */
  const images = dados.carrosselImagensHotel || [];
  let idx = 0;

  const imgDiv = document.getElementById("carrossel-images-hotel");
  const dots = document.getElementById("carrossel-dots-hotel");
  const counter = document.getElementById("carrossel-counter-hotel");

  function renderHotel() {
    imgDiv.innerHTML = "";
    dots.innerHTML = "";

    images.forEach((url, i) => {
      const img = document.createElement("img");
      img.src = url;
      img.className = "carrossel-image" + (i === idx ? " active" : "");
      imgDiv.appendChild(img);

      const dot = document.createElement("span");
      dot.className = "carrossel-dot" + (i === idx ? " active" : "");
      dot.onclick = () => { idx = i; renderHotel(); };
      dots.appendChild(dot);
    });

    counter.textContent = `${idx + 1} / ${images.length}`;
  }

  window.prevSlideHotel = () => {
    idx = (idx - 1 + images.length) % images.length;
    renderHotel();
  };

  window.nextSlideHotel = () => {
    idx = (idx + 1) % images.length;
    renderHotel();
  };

  if (images.length) renderHotel();

  /* DESTINOS */
  const container = document.getElementById("destinos-container");

  dados.destinosMultiplos?.forEach((d, i) => {
    const page = document.createElement("div");
    page.className = "page";

    page.innerHTML = `
      <img src="./assets/logo.png" class="logo">
      <h1>${d.nome}</h1>

      <h2>Passeios</h2>
      <p>${d.passeios}</p>

      <h2>Dicas</h2>
      <p>${d.dicas}</p>

      <div class="rodape">
        <img src="./assets/rodape.png">
      </div>
    `;

    container.appendChild(page);
  });

});


