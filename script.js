let lightboxIsOpen = false;

// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Garcez Elétrica - Site inicializado');
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initCarousels();
    initImageExpansion();
    initScrollHeader();
    initReviews();
    initAdditionalFeatures();
    initGoogleProfile();
    
    // Atualizar status de horário
    updateBusinessStatus();
    
    // Atualizar a cada 5 minutos
    setInterval(updateBusinessStatus, 300000);
});

// Menu móvel
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = nav.classList.toggle('active');
            this.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            this.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu');
            this.setAttribute('aria-expanded', isActive);
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuBtn.setAttribute('aria-label', 'Abrir menu');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Header ao rolar
function initScrollHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    });
}

// Animações ao rolar
function initScrollAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(element => observer.observe(element));
}

// Carrosséis
function initCarousels() {
    document.querySelectorAll('.carousel-service').forEach((carousel) => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const indicators = carousel.querySelectorAll('.indicator');
        const currentSlideElement = carousel.querySelector('.current-slide');
        const totalSlidesElement = carousel.querySelector('.total-slides');
        
        let currentSlide = 0;
        let autoplayInterval;
        
        if (totalSlidesElement) totalSlidesElement.textContent = slides.length;
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide]?.classList.add('active');
            
            if (currentSlideElement) currentSlideElement.textContent = currentSlide + 1;
        }
        
        function nextSlide() { showSlide((currentSlide + 1) % slides.length); }
        function prevSlide() { showSlide((currentSlide - 1 + slides.length) % slides.length); }
        
        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                if (!lightboxIsOpen) nextSlide();
            }, 4000);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }
        
        // Botões param e reiniciam autoplay
        if (nextBtn) {
            nextBtn.addEventListener('click', () => { 
                nextSlide(); 
                restartAutoplay(); 
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => { 
                prevSlide(); 
                restartAutoplay(); 
            });
        }
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                restartAutoplay();
            });
        });
        
        // Pausa se mouse estiver em cima
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        showSlide(0);
        startAutoplay();
    });
}

// LIGHTBOX
function initImageExpansion() {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    let currentImages = [];
    let currentIndex = 0;
    let isOpen = false;
    
    function openLightbox(images, startIndex) {
        currentImages = images;
        currentIndex = startIndex;
        isOpen = true;
        lightboxIsOpen = true;
        
        lightboxImage.src = currentImages[currentIndex];
        lightboxImage.style.opacity = '1';
        lightboxImage.style.display = 'block';
        
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
        
        lightboxModal.style.display = 'flex';
        setTimeout(() => {
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
        
        setTimeout(() => lightboxClose.focus(), 50);
    }
    
    function changeImage(newIndex) {
        currentIndex = newIndex;
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = currentImages[currentIndex];
            lightboxImage.onload = () => {
                lightboxImage.style.opacity = '1';
                if (lightboxCounter) {
                    lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
                }
            };
        }, 200);
    }
    
    function nextImage() {
        if (!isOpen) return;
        changeImage((currentIndex + 1) % currentImages.length);
    }
    
    function prevImage() {
        if (!isOpen) return;
        changeImage((currentIndex - 1 + currentImages.length) % currentImages.length);
    }
    
    function closeLightbox() {
        if (!isOpen) return;
        isOpen = false;
        lightboxIsOpen = false;
        
        lightboxModal.classList.remove('active');
        
        setTimeout(() => {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = '';
            lightboxImage.style.opacity = '1';
            
            // Garante que sempre exista um slide ativo
            document.querySelectorAll('.carousel-service').forEach(carousel => {
                const slides = carousel.querySelectorAll('.carousel-slide');
                if (!carousel.querySelector('.carousel-slide.active') && slides.length > 0) {
                    slides[0].classList.add('active');
                }
            });
        }, 300);
    }
    
    document.querySelectorAll('.expand-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const carouselIndex = parseInt(this.dataset.carousel) || 0;
            const slideIndex = parseInt(this.dataset.slide) || 0;
            const carousel = document.querySelectorAll('.carousel-service')[carouselIndex];
            
            if (!carousel) return;
            
            const images = Array.from(carousel.querySelectorAll('.carousel-slide img')).map(img => img.src);
            if (images.length > 0) openLightbox(images, slideIndex);
        });
    });
    
    document.querySelectorAll('.slide-image').forEach(slideImage => {
        slideImage.addEventListener('click', function(e) {
            if (e.target.closest('.expand-btn')) return;
            
            const slide = this.closest('.carousel-slide');
            const carousel = slide.closest('.carousel-service');
            const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
            const slideIndex = slides.indexOf(slide);
            const images = slides.map(s => s.querySelector('img').src);
            
            openLightbox(images, slideIndex);
        });
    });
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    
    lightboxModal.addEventListener('click', e => {
        if (e.target === lightboxModal) closeLightbox();
    });
    
    document.addEventListener('keydown', e => {
        if (!isOpen) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}

// Formulário
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Formulário enviado! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
}

// Scroll suave
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#inicio') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

// Funções para Avaliações
function initReviews() {
    console.log('Inicializando sistema de avaliações...');
    initReviewsCarousel();
    updateGoogleLinks();
}

// Atualizar links do Google
function updateGoogleLinks() {
    const placeId = 'SEU_PLACE_ID'; // Substitua pelo seu Place ID real
    
    const reviewsBtn = document.getElementById('googleReviewsBtn');
    const addReviewBtn = document.getElementById('addReviewBtn');
    
    if (reviewsBtn && placeId !== 'SEU_PLACE_ID') {
        reviewsBtn.href = `https://search.google.com/local/reviews?placeid=${placeId}`;
    }
    
    if (addReviewBtn && placeId !== 'SEU_PLACE_ID') {
        addReviewBtn.href = `https://search.google.com/local/writereview?placeid=${placeId}`;
    }
}

// Carrossel de Avaliações
function initReviewsCarousel() {
    const carousel = document.querySelector('.reviews-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.review-slide');
    const prevBtn = carousel.querySelector('.review-prev-btn');
    const nextBtn = carousel.querySelector('.review-next-btn');
    const indicators = carousel.querySelectorAll('.review-indicator');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let autoplayInterval;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    function getSlideWidth() {
        return slides[0].offsetWidth + 30;
    }
    
    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        
        const slideWidth = getSlideWidth();
        const slidesContainer = carousel.querySelector('.reviews-slides');
        
        slidesContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        slidesContainer.style.transition = 'transform 0.5s ease';
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentSlide);
        });
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Touch/Swipe para mobile
    function setupTouchEvents() {
        const slidesContainer = carousel.querySelector('.reviews-slides');
        
        slidesContainer.addEventListener('touchstart', touchStart);
        slidesContainer.addEventListener('touchmove', touchMove);
        slidesContainer.addEventListener('touchend', touchEnd);
        
        slidesContainer.addEventListener('mousedown', touchStart);
        slidesContainer.addEventListener('mousemove', touchMove);
        slidesContainer.addEventListener('mouseup', touchEnd);
        slidesContainer.addEventListener('mouseleave', touchEnd);
    }
    
    function touchStart(event) {
        if (event.type === 'touchstart') {
            startPos = event.touches[0].clientX;
        } else {
            startPos = event.clientX;
        }
        isDragging = true;
        
        const slidesContainer = carousel.querySelector('.reviews-slides');
        slidesContainer.style.transition = 'none';
    }
    
    function touchMove(event) {
        if (!isDragging) return;
        event.preventDefault();
        
        let currentPosition;
        if (event.type === 'touchmove') {
            currentPosition = event.touches[0].clientX;
        } else {
            currentPosition = event.clientX;
        }
        
        const diff = currentPosition - startPos;
        const slideWidth = getSlideWidth();
        
        currentTranslate = prevTranslate + diff;
        
        // Limitar movimento
        if (currentTranslate > 0) currentTranslate = 0;
        if (currentTranslate < -(slides.length - 1) * slideWidth) {
            currentTranslate = -(slides.length - 1) * slideWidth;
        }
        
        const slidesContainer = carousel.querySelector('.reviews-slides');
        slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const slideWidth = getSlideWidth();
        const movedBy = currentTranslate - prevTranslate;
        
        if (Math.abs(movedBy) > slideWidth * 0.2) {
            if (movedBy < 0 && currentSlide < slides.length - 1) {
                currentSlide += 1;
            } else if (movedBy > 0 && currentSlide > 0) {
                currentSlide -= 1;
            }
        }
        
        showSlide(currentSlide);
        
        prevTranslate = -currentSlide * slideWidth;
        currentTranslate = prevTranslate;
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (!lightboxIsOpen && !isDragging) {
                if (currentSlide === slides.length - 1) {
                    showSlide(0);
                } else {
                    nextSlide();
                }
            }
        }, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            restartAutoplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            restartAutoplay();
        });
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            restartAutoplay();
        });
    });
    
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    setupTouchEvents();
    showSlide(0);
    startAutoplay();
    
    window.addEventListener('resize', () => {
        showSlide(currentSlide);
    });
}

// Função para compartilhar perfil
function shareProfile() {
    const shareData = {
        title: 'Eletricista Garcez',
        text: 'Confira o perfil do Eletricista Garcez no Google! Serviços de elétrica, refrigeração e manutenção com qualidade e segurança.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Perfil compartilhado com sucesso!'))
            .catch(error => console.log('Erro ao compartilhar:', error));
    } else {
        // Fallback para copiar link
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('Link copiado para a área de transferência!');
            })
            .catch(err => {
                console.error('Erro ao copiar:', err);
                prompt('Copie o link:', window.location.href);
            });
    }
}

// Atualizar status de abertura baseado no horário
function updateBusinessStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const statusElement = document.querySelector('.status-open');
    const closingElement = document.querySelector('.closing-time');
    
    if (statusElement && closingElement) {
        const closingHour = 19;
        const isOpen = currentHour < closingHour || (currentHour === closingHour && currentMinute === 0);
        
        if (isOpen) {
            statusElement.textContent = 'Aberto';
            statusElement.style.color = '#34A853';
            
            const remainingHours = closingHour - currentHour - (currentMinute > 0 ? 1 : 0);
            const remainingMinutes = 60 - currentMinute;
            
            if (remainingHours > 0) {
                closingElement.textContent = `Fecha em ${remainingHours}h${remainingMinutes > 0 ? ` e ${remainingMinutes}min` : ''}`;
            } else if (remainingMinutes > 0) {
                closingElement.textContent = `Fecha em ${remainingMinutes}min`;
            } else {
                closingElement.textContent = 'Fecha agora';
            }
        } else {
            statusElement.textContent = 'Fechado';
            statusElement.style.color = '#EA4335';
            closingElement.textContent = 'Abre amanhã às 08:00';
        }
    }
}

// Inicializar Google Profile
function initGoogleProfile() {
    console.log('Google Profile section initialized');
    
    const profileSection = document.getElementById('perfil-google');
    if (profileSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    updateBusinessStatus();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(profileSection);
    }
    
    // Adicionar evento aos botões de rota
    document.querySelectorAll('.google-action-btn').forEach(button => {
        if (button.querySelector('.fa-route')) {
            button.addEventListener('click', openGoogleMaps);
        }
    });
    
    // Adicionar efeito de hover aos previews
    document.querySelectorAll('.preview-image').forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Função para abrir Google Maps
function openGoogleMaps() {
    window.open('https://maps.app.goo.gl/bz7m3fNuqpeB4fkd9', '_blank');
}

// Contadores animados - SEM %
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        // Remove APENAS o +, NUNCA adiciona %!
        const targetText = counter.textContent.replace('+', '');
        const target = parseInt(targetText);
        
        if (!isNaN(target) && target > 0) {
            // Se já tiver +, mantém
            const hasPlus = counter.textContent.includes('+');
            
            // Não adiciona % em NENHUMA hipótese!
            // (especialmente para Anos de Experiência)
        }
    });
}

// Detectar dispositivo
function detectDevice() {
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android|Tablet/i.test(navigator.userAgent) && !isMobile;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        console.log('Dispositivo móvel detectado');
    } else if (isTablet) {
        document.body.classList.add('tablet-device');
        console.log('Tablet detectado');
    } else {
        document.body.classList.add('desktop-device');
        console.log('Desktop detectado');
    }
}

// Funcionalidade de cópia de telefone
function initCopyPhone() {
    const phoneElements = document.querySelectorAll('[href^="tel:"]');
    
    phoneElements.forEach(element => {
        element.addEventListener('click', function(e) {
            if (navigator.clipboard && window.isSecureContext) {
                e.preventDefault();
                const phoneNumber = this.href.replace('tel:', '');
                
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    this.style.backgroundColor = '#28a745';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.backgroundColor = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Erro ao copiar:', err);
                });
            }
        });
    });
}

// Função para compartilhar perfil (estilo Google)
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'Garcez Elétrica e Manutenções',
            text: 'Perfil oficial no Google. Serviços de elétrica, refrigeração e manutenção.',
            url: window.location.href
        }).catch(() => {
            // Fallback se o usuário cancelar
            console.log('Compartilhamento cancelado');
        });
    } else {
        // Fallback para desktop
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

function updateGooglePlaceID() {
    const placeID = '0x94ce1d324d3a59af:0x87156c3451194a17'; 
    
    const reviewLinks = document.querySelectorAll('[href*="placeid=SEU_PLACE_ID"]');
    reviewLinks.forEach(link => {
        link.href = link.href.replace('SEU_PLACE_ID', placeID);
    });
}

// Chamar na inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateGooglePlaceID();
});

// Tracking de eventos
function trackEvents() {
    const trackButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .whatsapp-float');
    
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim() || this.getAttribute('aria-label') || 'Botão sem texto';
            console.log(`Botão clicado: ${buttonText}`);
        });
    });
}

// Inicializar funcionalidades adicionais
function initAdditionalFeatures() {
    initAnimatedCounters();
    detectDevice();
    initCopyPhone();
    trackEvents();
}

// Adicionar estilos CSS para funcionalidades adicionais
const additionalStyles = `
    /* Preloader Styles */
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--white);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }
    
    .preloader-content {
        text-align: center;
    }
    
    .preloader-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 30px;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-blue);
        font-family: 'Poppins', sans-serif;
    }
    
    .preloader-logo img {
        width: 50px;
        height: 50px;
        object-fit: contain;
    }
    
    .preloader-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid var(--light-blue);
        border-top-color: var(--primary-blue);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Melhorias de acessibilidade para foco */
    .review-card:focus-within {
        outline: 2px solid var(--primary-blue);
        outline-offset: 2px;
    }
    
    /* Transições suaves para todos os elementos interativos */
    .btn, .nav-link, .service-card, .feature-item, .contact-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Efeito de pulso para o botão do WhatsApp */
    .whatsapp-float {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
        }
        70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
        }
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);