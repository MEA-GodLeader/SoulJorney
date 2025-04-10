
const themeToggle = document.querySelector('.dark-mode-toggle');
const roomImages = document.querySelectorAll('.room-card img');
const slideImages = document.querySelectorAll('.slide img');
const scrollIndicator = document.getElementById("scrollIndicator");
const footer = document.querySelector('footer');
const socialContainer = document.querySelector('.social-container');
const languages = [
    { code: 'pt-BR', name: 'Português', flag: 'https://flagcdn.com/br.svg' },
    { code: 'en-US', name: 'English', flag: 'https://flagcdn.com/us.svg' },
    { code: 'fr-FR', name: 'Français', flag: 'https://flagcdn.com/fr.svg' },
    { code: 'es-ES', name: 'Español', flag: 'https://flagcdn.com/es.svg' }
];

    /*
    // Scroll animado inicial (apenas uma vez)
    window.addEventListener("load", () => {
        const hasScrolled = sessionStorage.getItem("hasScrolledOnce");
  
        if (!hasScrolled) {
          setTimeout(() => {
            window.scrollTo({ top: 150, behavior: "smooth" });
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 800);
          }, 600);
        }
      });
      */
  
      // Esconde o indicador definitivamente ao rolar
      function handleScroll() {
        if (window.scrollY > 0) {
          scrollIndicator.classList.add("hidden");
          sessionStorage.setItem("hasScrolledOnce", "true");
          window.removeEventListener("scroll", handleScroll);
        }
      }
  
      if (!sessionStorage.getItem("hasScrolledOnce")) {
        window.addEventListener("scroll", handleScroll);
      } else {
        scrollIndicator.classList.add("hidden");
      }

//Bota na escuridao total irmao
function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Trocar imagens dos quartos
    roomImages.forEach(img => {
        const src = isDark ? img.dataset.dark : img.dataset.original;
        if (src) img.src = src;
    });

    // Trocar imagens do slideshow
    slideImages.forEach(img => {
        const src = isDark ? img.dataset.dark : img.dataset.original;
        if (src) img.src = src;
    });
}



const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            footer.classList.add('active');
        } else {
            footer.classList.remove('active');
        }
    });
}, { threshold: 0.5 });

observer.observe(footer);

// Suavizar transição durante o scroll
window.addEventListener('scroll', () => {
    const footerRect = footer.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.8;
    
    if(footerRect.top < triggerPoint) {
        const progress = (triggerPoint - footerRect.top) / triggerPoint;
        socialContainer.style.transform = `scale(${1 + progress * 0.2})`;
    }
});


// Modal Booking quarto automatico
function selectRoom(roomType) {
    // Abre o modal
    hotelOpenModal();
    
    // Seleciona o quarto correspondente
    const select = document.getElementById('roomSelect');
    select.value = roomType;
    
    // Dispara as atualizações
    updateRoomDetails();
    calculatePrice();
}

// Modal Booking 
(function() {
    function calculateDays(checkIn, checkOut) {
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    
    // Funções do Modal
    window.hotelOpenModal = function() {
        const modal = document.getElementById('hotel-Booking-Modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    window.hotelCloseModal = function() {
        const modal = document.getElementById('hotel-Booking-Modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Fechar ao clicar fora
    document.addEventListener('click', function(event) {
        if (event.target.id === 'hotel-Booking-Modal') {
        hotelCloseModal();
        }
    });
    
    // Atualizar imagens do quarto
    function updateRoomDetails() {
        const select = document.getElementById('roomSelect');
        const selectedOption = select.options[select.selectedIndex];
        const images = selectedOption.dataset.images.split(',');
        
        const imagesContainer = document.getElementById('roomImages');
        imagesContainer.innerHTML = '';
        
        images.forEach(img => {
        const imageElement = document.createElement('img');
        imageElement.src = img;
        imagesContainer.appendChild(imageElement);
        });
        
        calculatePrice();
    }
    
    // Calcular preço
    function calculatePrice() {
        const checkIn = new Date(document.getElementById('checkInDate').value);
        const checkOut = new Date(document.getElementById('checkOutDate').value);
        const select = document.getElementById('roomSelect');
        const pricePerNight = parseFloat(select.options[select.selectedIndex]?.dataset.price) || 0;
        
        const nights = calculateDays(checkIn, checkOut);
        const total = nights * pricePerNight;
        document.getElementById('totalPrice').textContent = `R$ ${total.toFixed(2)}`;
    }
    
    // Submeter reserva
    function submitBooking() {
        alert('Reserva enviada com sucesso!');
        hotelCloseModal();
    }
    
    // Expor funções para o escopo global
    window.updateRoomDetails = updateRoomDetails;
    window.calculatePrice = calculatePrice;
    window.submitBooking = submitBooking;
    })();



// Colocar idioma
function setLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  
    localStorage.setItem('language', lang);
}
  
  // Carregar idioma salvo
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('language') || 'pt';
    setLanguage(savedLang);
});

// Controle dos Modais
function toggleModal() {
    const modal = document.getElementById('questionModal');
    const isActive = modal.classList.contains('active');
    
    modal.classList.toggle('active', !isActive);
    document.body.style.overflow = isActive ? 'auto' : 'hidden';
    document.querySelector('.question-button').classList.toggle('expanded', !isActive);
}

function toggleAuthModal(e) {
    if (e) e.preventDefault();
    const authModal = document.getElementById('authModal');
    authModal.classList.toggle('active');
    document.body.style.overflow = authModal.classList.contains('active') ? 'hidden' : 'auto';
}

// Sistema de Login/Registro
async function handleLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const spinner = document.createElement('div');
    
    try {
        spinner.className = 'loading-spinner';
        submitBtn.disabled = true;
        form.insertBefore(spinner, submitBtn.nextSibling);
        spinner.style.display = 'block';

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const email = form.loginEmail.value;
        const password = form.loginPassword.value;
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(form, 'E-mail inválido');
            return;
        }

        if (password.length < 6) {
            showError(form, 'Senha deve ter pelo menos 6 caracteres');
            return;
        }

        showSuccess('Login realizado com sucesso!');
        toggleAuthModal(e);
        
    } catch (error) {
        showError(form, 'Erro ao fazer login. Tente novamente.');
    } finally {
        submitBtn.disabled = false;
        spinner.remove();
    }
}

        // Carosel
        class RoomCarousel {
            constructor() {
                this.track = document.getElementById('carouselTrack');
                this.items = Array.from(this.track.children);
                this.currentIndex = 0;
                this.isAnimating = false;
                this.autoRotateInterval = null;
        
                this.cloneItems();
                this.items = Array.from(this.track.children); // Reatualiza com os clones
                this.currentIndex = this.originalLength; // Começa no primeiro "original" item do meio
        
                this.init();
            }
        
            cloneItems() {
                this.originalLength = this.items.length;
                const firstClones = this.items.slice(0, 2).map(item => item.cloneNode(true));
                const lastClones = this.items.slice(-2).map(item => item.cloneNode(true));
        
                firstClones.forEach(clone => this.track.appendChild(clone));
                lastClones.reverse().forEach(clone => this.track.insertBefore(clone, this.track.firstChild));
            }
        
            init() {
                this.setupEventListeners();
                this.updateCarousel(true);
                /*
                this.startAutoRotate();
                */
                this.setupIntersectionObserver();
                this.setupMouseHoverPause();
            }

            setupMouseHoverPause() {
                const hoverElements = [
                document.querySelector('.rooms-carousel'),
                document.querySelector('.carousel-prev'),
                document.querySelector('.carousel-next')
            ];
        
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => this.stopAutoRotate());
                el.addEventListener('mouseleave', () => this.startAutoRotate());
            });
        }
            
        
            setupEventListeners() {
                document.querySelector('.carousel-prev').addEventListener('click', () => this.move(-1));
                document.querySelector('.carousel-next').addEventListener('click', () => this.move(1));
        
                this.items.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        if (!this.isAnimating && index !== this.currentIndex) {
                            this.currentIndex = index;
                            this.updateCarousel();
                        }
                    });
                });
        
                window.addEventListener('resize', () => this.handleResize());
            }
        
            move(direction) {
                if (this.isAnimating) return;
            
                const nextIndex = this.currentIndex + direction;
                const total = this.items.length;
                const clonesAtStart = 2;
                const clonesAtEnd = 2;
                const firstRealIndex = clonesAtStart;
                const lastRealIndex = total - clonesAtEnd - 1;
            
                if (nextIndex > lastRealIndex) {
                    this.currentIndex = nextIndex - this.originalLength;
                    this.updateCarousel(true); // Teleporta para o índice equivalente
                    requestAnimationFrame(() => {
                        this.currentIndex += direction;
                        this.updateCarousel();
                    });
                } else if (nextIndex < firstRealIndex) {
                    this.currentIndex = nextIndex + this.originalLength;
                    this.updateCarousel(true); // Teleporta para o índice equivalente
                    requestAnimationFrame(() => {
                        this.currentIndex += direction;
                        this.updateCarousel();
                    });
                } else {
                    this.currentIndex = nextIndex;
                    this.updateCarousel();
                }
            }
            
        
            updateCarousel(instant = false) {
                this.isAnimating = true;
            
                const containerWidth = this.track.parentElement.offsetWidth;
                const activeItem = this.items[this.currentIndex];
                const itemOffset = activeItem.offsetLeft - (containerWidth - activeItem.offsetWidth) / 2;
            
                // Aplica a transição se não for instantâneo
                this.track.style.transition = instant ? 'none' : 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
                this.track.style.transform = `translateX(-${itemOffset}px)`;
            
                // Marca item ativo
                this.items.forEach((item, index) => {
                    item.classList.toggle('active', index === this.currentIndex);
                });
            
                // Aguarda animação terminar antes de verificar se está num clone
                setTimeout(() => {
                    const total = this.items.length;
                    const clonesAtStart = 2;
                    const clonesAtEnd = 2;
                    const firstRealIndex = clonesAtStart;
                    const lastRealIndex = total - clonesAtEnd - 1;
            
                    if (this.currentIndex > lastRealIndex) {
                        // Passou do último real -> teleporta para o correspondente no início
                        this.currentIndex = this.currentIndex - this.originalLength;
                        this.updateCarousel(true);
                    } else if (this.currentIndex < firstRealIndex) {
                        // Passou antes do primeiro real -> teleporta para o correspondente no fim
                        this.currentIndex = this.currentIndex + this.originalLength;
                        this.updateCarousel(true);
                    } else {
                        this.isAnimating = false;
                        this.track.style.transition = '';
                    }
                }, instant ? 0 : 800);
            }
                       
            /*
            startAutoRotate() {
                this.autoRotateInterval = setInterval(() => {
                    if (!document.hidden) this.move(1);
                }, 7000);
            }
            */
            stopAutoRotate() {
                clearInterval(this.autoRotateInterval);
            }
        
            setupIntersectionObserver() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.startAutoRotate();
                        } else {
                            this.stopAutoRotate();
                        }
                    });
                }, { threshold: 0.5 });
        
                observer.observe(this.track.parentElement);
            }
        
            handleResize() {
                this.updateCarousel(true);
            }
        }
        
        // Inicialize no DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            new RoomCarousel();
        });


// Inicialize no DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

// Funções Auxiliares
function showError(form, message) {
    let errorDiv = form.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    form.classList.add('error');
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
        form.classList.remove('error');
    }, 2000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
    `;
    
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme === 'dark');
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
    });

    // Login/Registro
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
    
    
    document.querySelector('.login-btn').addEventListener('click', toggleAuthModal);

    // Fechar Modais
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = btn.closest('.question-modal-overlay, .auth-modal-overlay');
            if (modal) {
                modal.classList.remove('active'); // Remove a classe diretamente
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Troca de Abas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.tab, .auth-form').forEach(el => {
                el.classList.remove('active');
            });
            tab.classList.add('active');
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });
});

// Fechar ao Clicar Fora
document.addEventListener('click', (e) => {
    // Fechar auth modal
    const authModal = document.getElementById('authModal');
    if (authModal.classList.contains('active')) {
        const authContent = document.querySelector('.auth-modal');
        if (!authContent.contains(e.target) && !e.target.closest('.login-btn')) {
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Fechar question modal
    const questionModal = document.getElementById('questionModal');
    if (questionModal.classList.contains('active')) {
        const questionContent = document.querySelector('.question-modal-content');
        if (!questionContent.contains(e.target) && !e.target.closest('.question-button')) {
            questionModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.querySelector('.question-button').classList.remove('expanded');
        }
    }
});


// Event listener para o botão de fechar
document.querySelectorAll('.auth-modal-content .close-btn').forEach(btn => {
    btn.addEventListener('click', toggleAuthModal);
});

// Fechar com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const authModal = document.getElementById('authModal');
        const questionModal = document.getElementById('questionModal');
        
        if (authModal.classList.contains('active')) {
            toggleAuthModal(e);
        }
        if (questionModal.classList.contains('active')) {
            toggleModal();
        }
    }
});

// Slideshow
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slide-dots');
    let currentSlide = 0;
    let autoSlideInterval;
  
    // limpa dots antigos
    dotsContainer.innerHTML = '';
  
    slides.forEach((slide, index) => {
      // 1) cria dot
      const dot = document.createElement('button');
      dot.classList.add('slide-dot');
      dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
  
      // 2) configura botão de selecionar quarto
      const btn = slide.querySelector('.slide-select-btn');
      btn.innerText = slide.dataset.button;
      btn.addEventListener('click', () => {
        selectRoom(slide.dataset.title);
      });
    });

    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', () => {
    const activeSlide = document.querySelector('.slide.active');
    selectRoom(activeSlide.dataset.title);
    });
  
    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dotsContainer.children[currentSlide].classList.remove('active');
  
      currentSlide = (index + slides.length) % slides.length;
  
      slides[currentSlide].classList.add('active');
      dotsContainer.children[currentSlide].classList.add('active');
    }
  
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }
  
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    hero.addEventListener('mouseleave', startAutoSlide);
  
    // inicia no slide 0
    goToSlide(0);
    startAutoSlide();

  }
  
  window.addEventListener('load', initSlideshow);
  


//Buscar Linguas
function toggleLanguageMenu() {
    const menu = document.querySelector('.language-menu');
    menu.classList.toggle('show');
    
    // Atualiza as opções do menu
    const currentLang = document.querySelector('.selected-language img').alt;
    menu.querySelectorAll('.language-option').forEach(option => {
        option.style.display = option.dataset.lang === currentLang ? 'none' : 'flex';
    });
}

document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', function() {
        const langCode = this.dataset.lang;
        const flagUrl = this.dataset.flag;
        
        // Atualiza o seletor principal
        const selected = document.querySelector('.selected-language');
        selected.innerHTML = `
            <img src="${flagUrl}" alt="${langCode}" class="flag">
            <span class="arrow">▼</span>
        `;
        
        // Carrega o idioma
        loadLanguage(langCode);
        
        // Salva a preferência
        localStorage.setItem('selectedLanguage', langCode);
        localStorage.setItem('selectedFlag', flagUrl);
        
        // Fecha o menu
        toggleLanguageMenu();
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', function(e) {
    if (!e.target.closest('.language-switcher')) {
        document.querySelector('.language-menu').classList.remove('show');
    }
});

// Carregar preferências salvas
window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'pt-BR';
    const savedFlag = localStorage.getItem('selectedFlag') || 'https://flagcdn.com/br.svg';
    
    // Atualiza o seletor
    document.querySelector('.selected-language').innerHTML = `
        <img src="${savedFlag}" alt="${savedLang}" class="flag">
        <span class="arrow">▼</span>
    `;
    
    // Carrega o idioma
    loadLanguage(savedLang);
});

function loadLanguage(lang) {
    // Sua função para carregar traduções
    console.log(`Idioma carregado: ${lang}`);
    // Implemente a lógica de carregamento das traduções aqui
}


window.addEventListener('load', initSlideshow);

// Porta Interativa (se necessário)
function toggleDoor(element) {
    const door = element.querySelector('.door');
    const container = element.closest('.image-container');
    const img = container.querySelector('img');
    const sound = document.getElementById('doorSound');

    door.classList.toggle('open');
    container.classList.toggle('door-open');

    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
    
    if (door.classList.contains('open')) {
        img.style.transform = 'scale(1.02)';
        img.style.filter = 'brightness(1.3) contrast(0.85)';
    } else {
        img.style.transform = 'scale(1)';
        img.style.filter = 'none';
    }
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        if (card.classList.contains('active')) {
            card.classList.remove('active');
        } else {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        }
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.card')) {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    }
});

// Controle de visibilidade do botão flutuante
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const floatingButton = document.querySelector('.dark-mode-toggle-floating');
    
    function checkScroll() {
        const headerBottom = header.offsetHeight;
        if (window.scrollY > headerBottom) {
            floatingButton.style.display = 'flex';
            document.body.classList.add('hide-header-button');
        } else {
            floatingButton.style.display = 'none';
            document.body.classList.remove('hide-header-button');
        }
    }

    // Otimização do evento scroll
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(checkScroll, 50);
    });

    // Controle do tema escuro
    function toggleDarkMode() {
        const body = document.body;
        const isDark = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    // Event listeners para ambos os botões
    document.querySelectorAll('.dark-mode-toggle, .dark-mode-toggle-floating').forEach(button => {
        button.addEventListener('click', toggleDarkMode);
    });

    // Verificar tema ao carregar
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.body.setAttribute('data-theme', savedTheme);
});