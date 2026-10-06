/**
 * DV ADVOGADOS | DIEGO VALÉRIO - DIREITO DA SAÚDE & AUTISMO
 * Scripts de Interatividade, Rolagem Suave, Ações de Mapa e Contato
 */

document.addEventListener('DOMContentLoaded', () => {
    initOfficeStatus();
    initNavbarScroll();
    initScrollProgressBar();
    initSmoothScrolling();
    initScrollReveal();
    initMobileMenu();
    initBackToTop();
    initGoogleMapsActions();
    initContactForm();
    initYear();
});

/* ==========================================================================
   1. HORÁRIO DE ATENDIMENTO DINÂMICO (ABERTO / FECHADO)
   ========================================================================== */
function initOfficeStatus() {
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    if (!statusBadge || !statusText) return;

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Domingo, 6 = Sábado
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hour * 60 + minutes;

    // Horário: Segunda (1) a Sexta (5), das 08:00 (480 min) às 18:00 (1080 min)
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isOpen = isWeekday && currentTimeInMinutes >= (8 * 60) && currentTimeInMinutes < (18 * 60);

    if (isOpen) {
        statusBadge.classList.remove('closed');
        statusText.textContent = 'Aberto agora · Fecha às 18:00';
    } else {
        statusBadge.classList.add('closed');
        if (isWeekday && currentTimeInMinutes < 8 * 60) {
            statusText.textContent = 'Fechado agora · Abre às 08:00';
        } else if (dayOfWeek === 5 && currentTimeInMinutes >= 18 * 60) {
            statusText.textContent = 'Fechado · Abre segunda às 08:00';
        } else if (dayOfWeek === 6 || dayOfWeek === 0) {
            statusText.textContent = 'Fechado no final de semana · Abre segunda às 08:00';
        } else {
            statusText.textContent = 'Fechado agora · Abre amanhã às 08:00';
        }
    }
}

/* ==========================================================================
   2. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   2.1 BARRA DE PROGRESSO DE ROLAGEM DINÂMICA
   ========================================================================== */
function initScrollProgressBar() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
    });
}

/* ==========================================================================
   2.2 ROLAGEM SUAVE COM COMPENSAÇÃO DE NAVBAR FIXA
   ========================================================================== */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = 80;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   2.3 REVEAL DE ELEMENTOS DURANTE A ROLAGEM (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const targets = document.querySelectorAll('.practice-card, .info-card, .about-images-wrapper, .about-content, .contact-box');
    if (!('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

/* ==========================================================================
   3. MENU MOBILE (HAMBURGER)
   ========================================================================== */
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

    if (!hamburgerBtn || !navMenu) return;

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburgerBtn.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburgerBtn.classList.remove('active');
        });
    });
}

/* ==========================================================================
   4. VOLTAR AO TOPO
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   5. AÇÕES GOOGLE MAPS (SALVAR, SMARTPHONE, COMPARTILHAR, PLUS CODE)
   ========================================================================== */
function initGoogleMapsActions() {
    const btnShareTop = document.getElementById('btnShareTop');
    const btnCompartilhar = document.getElementById('btnCompartilhar');
    const btnSalvarLocal = document.getElementById('btnSalvarLocal');
    const btnEnviarSmartphone = document.getElementById('btnEnviarSmartphone');
    const plusCodeCopy = document.getElementById('plusCodeCopy');

    const addressText = "DV Advogados | Diego Valério - Av. Adolfo Lutz, 762, Vila Santa Cruz, São José do Rio Preto - SP";
    const mapsUrl = "https://goo.gl/maps/search/?api=1&query=Av.+Adolfo+Lutz,+762+-+Vila+Santa+Cruz,+S%C3%A3o+Jos%C3%A9+do+Rio+Preto+-+SP";

    // Compartilhar
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'DV Advogados | Diego Valério - Direito da Saúde e Autismo',
                    text: 'Conheça o escritório DV Advogados (Dr. Diego Valério) em São José do Rio Preto - SP (Direito da Saúde & Autismo):',
                    url: window.location.href,
                });
            } catch (err) {
                // Usuário cancelou ou navegador não permitiu
            }
        } else {
            // Fallback: copiar link
            copyToClipboard(window.location.href, 'Link do escritório copiado com sucesso!');
        }
    };

    if (btnShareTop) btnShareTop.addEventListener('click', handleShare);
    if (btnCompartilhar) btnCompartilhar.addEventListener('click', handleShare);

    // Salvar localização
    if (btnSalvarLocal) {
        btnSalvarLocal.addEventListener('click', () => {
            copyToClipboard(mapsUrl, 'Link do Google Maps copiado para salvar nos seus favoritos!');
        });
    }

    // Enviar para o smartphone
    if (btnEnviarSmartphone) {
        btnEnviarSmartphone.addEventListener('click', () => {
            const shareText = encodeURIComponent(`Localização DV Advogados (Dr. Diego Valério):\n${addressText}\n${mapsUrl}`);
            const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
            window.open(whatsappShareUrl, '_blank');
        });
    }

    // Copiar Plus Code
    if (plusCodeCopy) {
        plusCodeCopy.addEventListener('click', () => {
            copyToClipboard('5JHF+PR Vila Santa Cruz, São José do Rio Preto - SP', 'Plus Code copiado com sucesso!');
        });
    }
}

/* ==========================================================================
   6. FORMULÁRIO DE CONTATO DIRETO PARA O WHATSAPP
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !phone || !message) {
            showToast('Por favor, preencha os campos obrigatórios (*).');
            return;
        }

        // Formata mensagem elegante para o WhatsApp
        let text = `*NOVO CONTATO VIA SITE - DV ADVOGADOS*\n\n`;
        text += `👤 *Nome:* ${name}\n`;
        text += `📱 *Telefone:* ${phone}\n`;
        if (email) text += `✉️ *E-mail:* ${email}\n`;
        text += `⚖️ *Assunto:* ${subject}\n\n`;
        text += `📝 *Mensagem:* \n"${message}"`;

        const encodedMessage = encodeURIComponent(text);
        const whatsappNumber = "5517982187628";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        showToast('Redirecionando para o WhatsApp do escritório...');
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 800);
    });
}

/* ==========================================================================
   7. TOAST NOTIFICATION & CLIPBOARD HELPER
   ========================================================================== */
function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg);
        }).catch(() => {
            fallbackCopyText(text, successMsg);
        });
    } else {
        fallbackCopyText(text, successMsg);
    }
}

function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(successMsg);
    } catch (err) {
        showToast('Não foi possível copiar automaticamente.');
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

/* ==========================================================================
   8. ANO ATUAL AUTOMÁTICO
   ========================================================================== */
function initYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

