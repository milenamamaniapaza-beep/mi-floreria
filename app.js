// Mi Florería - cliente Supabase
// La clave publishable se puede usar en el navegador; nunca coloques aquí una service_role/secret key.
const SUPABASE_URL = "https://iqubvospuniyvotvtedd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_JBfxQ_rpDHY26oayS7drfA_BNTnP67R";

const authPanel = document.getElementById("authPanel");
const dashboard = document.getElementById("dashboard");
const authForm = document.getElementById("authForm");
const authMessage = document.getElementById("authMessage");
const logoutBtn = document.getElementById("logoutBtn");
const dataPanel = document.getElementById("dataPanel");
const dataRows = document.getElementById("dataRows");
const dataTitle = document.getElementById("dataTitle");
const dataMessage = document.getElementById("dataMessage");
const setupNotice = document.getElementById("setupNotice");

let supabaseClient = null;
const labels = {
  flores:"Flores", materiales:"Materiales", compras:"Compras", producciones:"Producción",
  clientes:"Clientes", pedidos:"Pedidos", pagos_clientes:"Pagos de clientes",
  gastos:"Gastos", movimientos_caja:"Movimientos de caja", proveedores:"Proveedores"
};

function showMessage(el, message, isError=false) {
  el.textContent = message;
  el.style.color = isError ? "#a12828" : "";
}
function showDashboard() {
  authPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
}
function showAuth() {
  authPanel.classList.remove("hidden");
  dashboard.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  dataPanel.classList.add("hidden");
}
async function init() {
  if (!window.supabase || SUPABASE_PUBLISHABLE_KEY.startsWith("REEMPLAZA")) {
    setupNotice.classList.remove("hidden");
    showMessage(authMessage, "Falta configurar la clave publicable de Supabase en app.js.", true);
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) showDashboard();
  supabaseClient.auth.onAuthStateChange((_event, session) => session ? showDashboard() : showAuth());
}
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) return showMessage(authMessage, "Primero configura la clave en app.js.", true);
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  showMessage(authMessage, "Ingresando...");
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  showMessage(authMessage, error ? error.message : "Sesión iniciada.");
  if (!error) showDashboard();
});
document.getElementById("signupBtn").addEventListener("click", async () => {
  if (!supabaseClient) return showMessage(authMessage, "Primero configura la clave en app.js.", true);
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || password.length < 6) return showMessage(authMessage, "Escribe tu correo y una contraseña de al menos 6 caracteres.", true);
  showMessage(authMessage, "Creando cuenta...");
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) return showMessage(authMessage, error.message, true);
  showMessage(authMessage, data.session ? "Cuenta creada. Ya puedes ingresar." : "Cuenta creada. Revisa tu correo para confirmar la cuenta.");
});
logoutBtn.addEventListener("click", async () => {
  if (supabaseClient) await supabaseClient.auth.signOut();
  showAuth();
});
document.querySelectorAll(".tile").forEach(btn => btn.addEventListener("click", () => loadTable(btn.dataset.table)));
document.getElementById("closeData").addEventListener("click", () => dataPanel.classList.add("hidden"));

async function loadTable(table) {
  dataPanel.classList.remove("hidden");
  dataTitle.textContent = labels[table] || table;
  dataRows.innerHTML = "";
  showMessage(dataMessage, "Consultando registros...");
  dataPanel.scrollIntoView({behavior:"smooth", block:"start"});
  if (!supabaseClient) return showMessage(dataMessage, "No se pudo conectar con Supabase.", true);
  const { data, error } = await supabaseClient.from(table).select("*").limit(30);
  if (error) {
    showMessage(dataMessage, "No se pudieron cargar los datos: " + error.message, true);
    return;
  }
  if (!data || data.length === 0) {
    showMessage(dataMessage, "Todavía no hay registros en esta sección.");
    return;
  }
  showMessage(dataMessage, `Se muestran ${data.length} registros (máximo 30).`);
  data.forEach((record, index) => {
    const card = document.createElement("article");
    card.className = "data-row";
    const heading = document.createElement("strong");
    heading.textContent = `${index + 1}. ${record.nombre || record.descripcion || record.categoria || record.id || "Registro"}`;
    card.appendChild(heading);
    const details = document.createElement("div");
    details.textContent = Object.entries(record)
      .filter(([key, value]) => !["id", "owner_id"].includes(key) && value !== null && value !== "")
      .map(([key, value]) => `${key.replaceAll("_"," ")}: ${typeof value === "object" ? JSON.stringify(value) : value}`)
      .join(" · ");
    card.appendChild(details);
    dataRows.appendChild(card);
  });
}
init();
