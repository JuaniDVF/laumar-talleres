// ---------- CONFIGURACIÓN WHATSAPP ----------
const TELEFONO = "5491121931332";
const WA_BASE = `https://wa.me/${TELEFONO}?text=`;

function abrirWhatsApp(mensajePersonalizado) {
    const texto = encodeURIComponent(
        `Hola ✨\n\n` +
        `Me interesa: ${mensajePersonalizado}\n\n` +
        `¿Podrían darme más información sobre disponibilidad y cómo anotarme? ¡Gracias! 🙌`
    );
    window.open(WA_BASE + texto, '_blank');
}

const talleresData = {
    ceramica: {
        nombre: "CERÁMICA",
        icono: "fa-palette",
        descripcion: "Modelá, creá y dale forma a tus ideas · 1 vez por semana · 2hs",
        opciones: [
            { dia: "MARTES", tipo: "Niños", horarios: ["9:30 a 11:30", "14:00 a 16:00"], efectivo: 32000, transferencia: 38000 },
            { dia: "MIÉRCOLES", tipo: "Adultos", horarios: ["9:30 a 11:30", "14:00 a 16:00"], efectivo: 38000, transferencia: 40000 },
            { dia: "JUEVES", tipo: "Adultos", horarios: ["9:30 a 11:30", "14:00 a 16:00"], efectivo: 38000, transferencia: 40000 },
            { dia: "SÁBADO", tipo: "Adultos", horarios: ["10:00 a 12:00"], efectivo: 38000, transferencia: 40000 }
        ]
    },
    alambre: {
        nombre: "ALAMBRE",
        icono: "fa-gem",
        descripcion: "Diseñá, armá y llevá tu creatividad a todas partes · 1 vez por semana · 2hs",
        opciones: [
            { dia: "VIERNES", tipo: "Todos", horarios: ["15:00 a 17:00"], efectivo: 30000, transferencia: "consultar" }
        ]
    },
    velas: {
        nombre: "VELAS AROMÁTICAS",
        icono: "fa-candle",
        descripcion: "Aprendé a crear tus propias velas desde cero · Seminario única clase · 2hs",
        opciones: [
            { dia: "LUNES", tipo: "Todos", horarios: ["mañana y tarde"], efectivo: 30000, transferencia: 35000, nota: "Una sola clase" }
        ]
    },
    jabones: {
        nombre: "JABONES ARTESANALES",
        icono: "fa-soap",
        descripcion: "Elaborá jabones artesanales naturales · Seminario única clase · 2hs",
        opciones: [
            { dia: "JUEVES", tipo: "Adultos", horarios: ["17:00 a 19:00"], efectivo: "consultar", transferencia: 35000, nota: "Una sola clase" }
        ]
    }
};

let currentTaller = null;
const mainContent = document.getElementById("mainContent");

function renderizarMenu() {
    currentTaller = null;
    let html = `<div class="talleres-menu">`;
    for (const [key, taller] of Object.entries(talleresData)) {
        html += `
            <div class="taller-card" data-taller="${key}">
                <i class="fas ${taller.icono}"></i>
                <h3>${taller.nombre}</h3>
                <p>${taller.descripcion.substring(0, 60)}...</p>
            </div>
        `;
    }
    html += `</div>`;
    mainContent.innerHTML = html;
    
    document.querySelectorAll('.taller-card').forEach(card => {
        card.addEventListener('click', () => {
            const tallerKey = card.getAttribute('data-taller');
            renderizarDetalle(tallerKey);
        });
    });
}

function renderizarDetalle(tallerKey) {
    currentTaller = tallerKey;
    const taller = talleresData[tallerKey];
    if (!taller) return;
    
    let html = `
        <button id="btnVolver" class="btn-back">
            <i class="fas fa-arrow-left"></i> Volver a talleres
        </button>
        <div class="opciones-container">
            <div class="titulo-seccion">
                <i class="fas ${taller.icono}"></i> ${taller.nombre}
            </div>
            <div class="subtitulo-seccion">
                ${taller.descripcion}
            </div>
    `;
    
    const opcionesPorDia = {};
    taller.opciones.forEach(op => {
        if (!opcionesPorDia[op.dia]) opcionesPorDia[op.dia] = [];
        opcionesPorDia[op.dia].push(op);
    });
    
    for (const [dia, opciones] of Object.entries(opcionesPorDia)) {
        html += `
            <div class="grupo-dias">
                <div class="dia-titulo">
                    <i class="fas fa-calendar-alt"></i> ${dia}
                </div>
                <div class="horarios-grid">
        `;
        opciones.forEach(op => {
            op.horarios.forEach(horario => {
                // NUEVO MENSAJE SIN EFECTIVO NI TRANSFERENCIA
                const mensajeWhatsApp = `${taller.nombre} · ${dia} ${op.tipo} · ${horario}`;
                html += `
                    <div class="opcion-item">
                        <div class="horario-texto">
                            <i class="fas fa-clock"></i> ${horario}
                            ${op.tipo !== "Todos" ? `<span style="font-size:0.9rem; margin-left:0.5rem;">👥 ${op.tipo}</span>` : ''}
                        </div>
                        <div class="precios">
                            <span class="precio-item">💰 Efectivo ${typeof op.efectivo === 'number' ? `$${op.efectivo.toLocaleString()}` : op.efectivo}</span>
                            <span class="precio-item">💸 Transferencia ${typeof op.transferencia === 'number' ? `$${op.transferencia.toLocaleString()}` : op.transferencia}</span>
                        </div>
                        ${op.nota ? `<div style="font-size:0.85rem; color:var(--indigo); margin-top:0.4rem;">📌 ${op.nota}</div>` : ''}
                        <button class="btn-wsp-opcion" data-mensaje="${mensajeWhatsApp.replace(/"/g, '&quot;')}">
                            <i class="fab fa-whatsapp"></i> Consultar este turno
                        </button>
                    </div>
                `;
            });
        });
        html += `</div></div>`;
    }
    
    html += `<div style="margin-top: 1.8rem; text-align: center; background: #F4F0FF; padding: 1rem; border-radius: 1.2rem; font-size: 0.95rem;">
                <i class="fas fa-heart" style="color: var(--happy-indigo);"></i> Todos los materiales incluidos · No necesitas experiencia 
                <i class="fas fa-heart" style="color: var(--happy-indigo);"></i>
            </div>`;
    html += `</div>`;
    
    mainContent.innerHTML = html;
    document.getElementById('btnVolver').addEventListener('click', renderizarMenu);
    document.querySelectorAll('.btn-wsp-opcion').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const mensaje = btn.getAttribute('data-mensaje');
            abrirWhatsApp(mensaje);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarMenu();
    const btnGeneral = document.getElementById('btnContactoGeneral');
    if (btnGeneral) {
        btnGeneral.addEventListener('click', () => {
            abrirWhatsApp("consultas generales sobre los talleres");
        });
    }
    console.log("✅ LAUMAR · Paleta Indigo cargada: Tropical Indigo + Happy Indigo + Indigo");
});