const toggleBtn = document.getElementById('menu-toggle');
const closeBtn = document.getElementById('close-menu');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-link');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('active');
});

// Close sidebar when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });
});

// Highlight nav link on scroll
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Scroll reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Contact form — sends to Formspree, which forwards to your Gmail
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMsg");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        successMsg.style.color = "#00e676";
        successMsg.textContent = "✅ Message sent successfully!";
        form.reset();
      } else {
        const result = await response.json().catch(() => null);
        const errorText = result && result.errors
          ? result.errors.map(err => err.message).join(", ")
          : "Please try again.";
        successMsg.style.color = "#ff5252";
        successMsg.textContent = "❌ Error: " + errorText;
      }
    } catch (error) {
      successMsg.style.color = "#ff5252";
      successMsg.textContent = "❌ Something went wrong. Please try again.";
    }

    submitBtn.textContent = "Send Message";
    submitBtn.disabled = false;
  });
});