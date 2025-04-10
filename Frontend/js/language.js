// js/language.js
const translations = {
  'pt-BR': {
      // Header
      navHome: "Home",
      navRooms: "Quartos",
      navAbout: "Sobre nós",
      navContact: "Contato",
      loginBtn: "Login",
      langPt: "Português",
      langEn: "English",
      langFr: "Français",
      langEs: "Español",

      // Hero Section
      heroTitle: "Suítes e Quartos",
      heroSubtitle: "Nossos luxuosos quartos apresentam designs exclusivos e decoração premium.",

      // Rooms Section
      roomLuxo: "Luxo",
      roomImperial: "Suíte Imperial",
      roomClassico: "Quarto Clássico",
      chooseRoom: "Escolher quarto",

      // Amenities
      wifi: "Wi-Fi",
      security: "Segurança",
      food: "Alimentação",
      reception: "Recepção",
      pool: "Piscina",
      gym: "Academia",
      wifiDesc: "Conexão de alta velocidade para manter você sempre conectado.",
      securityDesc: "Sistema de monitoramento 24h para garantir sua tranquilidade.",
      foodDesc: "Café da manhã e almoço preparados com qualidade e sabor.",
      receptionDesc: "Atendimento personalizado para sua comodidade desde a chegada.",
      poolDesc: "Área com piscina para relaxar e aproveitar o sol.",
      gymDesc: "Espaço equipado para manter sua rotina de exercícios.",

      // About
      historyTitle: "Nossa História",
      historyText: "Fundado em 1980 por Josué, começou como um local acolhedor e se transformou em referência em hospedagem.",
      suitesCount: "Suítes Exclusivas",
      rating: "Avaliação dos Hóspedes",
      awards: "Prêmios de Excelência",

      // Booking Modal
      bookingTitle: "Faça sua reserva",
      checkIn: "Data de Entrada:",
      checkOut: "Data de Saída:",
      selectRoom: "Selecione o Quarto:",
      confirmBooking: "Confirmar Reserva",

      // Auth Modal
      login: "Login",
      register: "Registro",
      email: "E-mail",
      password: "Senha",
      fullName: "Nome completo",
      createAccount: "Criar nova conta",
      accessAccount: "Acessar minha conta",

      // Footer
      aboutUs: "Sobre Nós",
      usefulLinks: "Links Úteis",
      contact: "Contato",
      footerAbout: "Disturbing the peace...",
      footerContact: "Looking in to my eyes...",
      footerLinks: "The tenacity..."
  },
  'en-US': {
      // Header
      navHome: "Home",
      navRooms: "Rooms",
      navAbout: "About",
      navContact: "Contact",
      loginBtn: "Login",
      langPt: "Portuguese",
      langEn: "English",
      langFr: "French",
      langEs: "Spanish",

      // Hero Section
      heroTitle: "Rooms and Suites",
      heroSubtitle: "Our luxury bedrooms showcase exclusive designs and premium decor.",

      // Rooms Section
      roomLuxo: "Luxury",
      roomImperial: "Imperial Suite",
      roomClassico: "Classic Room",
      chooseRoom: "Choose Room",

      // Amenities
      wifi: "Wi-Fi",
      security: "Security",
      food: "Dining",
      reception: "Reception",
      pool: "Pool",
      gym: "Gym",
      wifiDesc: "High-speed connection to keep you always connected.",
      securityDesc: "24/7 monitoring system to ensure your safety.",
      foodDesc: "Breakfast and lunch prepared with quality and taste.",
      receptionDesc: "Personalized service for your comfort from arrival.",
      poolDesc: "Pool area to relax and enjoy the sun.",
      gymDesc: "Fully equipped space to maintain your exercise routine.",

      // About
      historyTitle: "Our History",
      historyText: "Founded in 1980 by Joshua, started as a cozy place and became a hospitality reference.",
      suitesCount: "Exclusive Suites",
      rating: "Guest Rating",
      awards: "Excellence Awards",

      // Booking Modal
      bookingTitle: "Make your reservation",
      checkIn: "Check-in Date:",
      checkOut: "Check-out Date:",
      selectRoom: "Select Room:",
      confirmBooking: "Confirm Booking",

      // Auth Modal
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      createAccount: "Create Account",
      accessAccount: "Access My Account",

      // Footer
      aboutUs: "About Us",
      usefulLinks: "Useful Links",
      contact: "Contact",
      footerAbout: "Disturbing the peace...",
      footerContact: "Looking in to my eyes...",
      footerLinks: "The tenacity..."
  },
  'fr-FR': {
      // Traduções em francês...
  },
  'es-ES': {
      // Traduções em espanhol...
  }
};

// Função para carregar traduções
function loadLanguage(lang) {
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if(translations[lang][key]) {
          element.textContent = translations[lang][key];
          
          // Para inputs/placeholders
          if(element.placeholder) {
              element.placeholder = translations[lang][key];
          }
      }
  });

  // Atualizar preços formatados
  const priceElements = document.querySelectorAll('[data-price]');
  priceElements.forEach(element => {
      const price = element.getAttribute('data-price');
      element.textContent = new Intl.NumberFormat(lang, {
          style: 'currency',
          currency: lang === 'pt-BR' ? 'BRL' : 'USD'
      }).format(price);
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLanguage') || 'pt-BR';
  loadLanguage(savedLang);
});