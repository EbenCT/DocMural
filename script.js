// Datos estáticos iniciales
const staticDoctors = [
    {
        id: 1,
        name: "Dr. María González",
        specialty: "Cardiología",
        phone: "+591 70123456",
        clinic: "Clínica Santa María",
        schedule: "Lun-Vie 8:00-17:00",
        address: "Av. San Martín #123",
        experience: 15
    },
    {
        id: 2,
        name: "Dr. Carlos Mendoza",
        specialty: "Pediatría",
        phone: "+591 71234567",
        clinic: "Hospital Infantil",
        schedule: "Lun-Sáb 9:00-18:00",
        experience: 12
    },
    {
        id: 3,
        name: "Dra. Ana Rodríguez",
        specialty: "Dermatología",
        phone: "+591 72345678",
        schedule: "Mar-Vie 14:00-19:00",
        address: "Calle Bolívar #456"
    },
    {
        id: 4,
        name: "Dr. Luis Torres",
        specialty: "Traumatología",
        phone: "+591 73456789",
        clinic: "Centro Médico Los Andes",
        experience: 20
    },
    {
        id: 5,
        name: "Dra. Carmen Silva",
        specialty: "Ginecología",
        phone: "+591 74567890",
        schedule: "Lun-Vie 10:00-16:00",
        address: "Av. América #789",
        experience: 8
    }
];

// Variables globales
let doctors = [];
let filteredDoctors = [];

// Elementos del DOM
const doctorsGrid = document.getElementById('doctorsGrid');
const searchInput = document.getElementById('searchInput');
const newRegistrationBtn = document.getElementById('newRegistrationBtn');
const registrationModal = document.getElementById('registrationModal');
const closeModal = document.getElementById('closeModal');
const doctorForm = document.getElementById('doctorForm');
const cancelBtn = document.getElementById('cancelBtn');
const noResults = document.getElementById('noResults');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    loadDoctors();
    setupEventListeners();
    renderDoctors();
});

// Cargar doctores desde localStorage y datos estáticos
function loadDoctors() {
    const savedDoctors = JSON.parse(localStorage.getItem('doctors')) || [];
    
    // Combinar doctores estáticos con los guardados
    const allDoctors = [...staticDoctors];
    
    // Agregar doctores guardados que no sean duplicados
    savedDoctors.forEach(savedDoc => {
        if (!allDoctors.some(doc => doc.id === savedDoc.id)) {
            allDoctors.push(savedDoc);
        }
    });
    
    doctors = allDoctors;
    filteredDoctors = [...doctors];
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda en tiempo real
    searchInput.addEventListener('input', handleSearch);
    
    // Modal
    newRegistrationBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalHandler);
    cancelBtn.addEventListener('click', closeModalHandler);
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === registrationModal) {
            closeModalHandler();
        }
    });
    
    // Formulario
    doctorForm.addEventListener('submit', handleFormSubmit);
}

// Manejar búsqueda
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredDoctors = [...doctors];
    } else {
        filteredDoctors = doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm) ||
            doctor.specialty.toLowerCase().includes(searchTerm)
        );
    }
    
    renderDoctors();
}

// Abrir modal
function openModal() {
    registrationModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModalHandler() {
    registrationModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    doctorForm.reset();
}

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(doctorForm);
    const newDoctor = {
        id: Date.now(), // ID único basado en timestamp
        name: formData.get('name').trim(),
        specialty: formData.get('specialty').trim(),
        phone: formData.get('phone').trim(),
        clinic: formData.get('clinic') ? formData.get('clinic').trim() : null,
        schedule: formData.get('schedule') ? formData.get('schedule').trim() : null,
        address: formData.get('address') ? formData.get('address').trim() : null,
        experience: formData.get('experience') ? parseInt(formData.get('experience')) : null
    };
    
    // Validar campos obligatorios
    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.phone) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    // Agregar doctor a la lista
    doctors.push(newDoctor);
    filteredDoctors = [...doctors];
    
    // Guardar en localStorage (solo los doctores nuevos, no los estáticos)
    const dynamicDoctors = doctors.filter(doc => !staticDoctors.some(staticDoc => staticDoc.id === doc.id));
    localStorage.setItem('doctors', JSON.stringify(dynamicDoctors));
    
    // Cerrar modal y actualizar vista
    closeModalHandler();
    renderDoctors();
    
    // Mostrar mensaje de éxito
    showSuccessMessage();
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00b894, #00cec9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 184, 148, 0.3);
        z-index: 1001;
        animation: slideIn 0.5s ease;
    `;
    message.innerHTML = '<i class="fas fa-check"></i> Doctor registrado exitosamente';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Renderizar doctores
function renderDoctors() {
    if (filteredDoctors.length === 0) {
        doctorsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    doctorsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    doctorsGrid.innerHTML = filteredDoctors.map(doctor => createDoctorCard(doctor)).join('');
}

// Crear tarjeta de doctor
function createDoctorCard(doctor) {
    const optionalFields = [];
    
    // Agregar campos opcionales si existen
    if (doctor.clinic) {
        optionalFields.push(`
            <div class="detail-item">
                <i class="fas fa-hospital"></i>
                <span>${doctor.clinic}</span>
            </div>
        `);
    }
    
    if (doctor.schedule) {
        optionalFields.push(`
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>${doctor.schedule}</span>
            </div>
        `);
    }
    
    if (doctor.address) {
        optionalFields.push(`
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${doctor.address}</span>
            </div>
        `);
    }
    
    if (doctor.experience) {
        optionalFields.push(`
            <div class="detail-item">
                <i class="fas fa-user-md"></i>
                <span>${doctor.experience} años de experiencia</span>
            </div>
        `);
    }
    
    return `
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <span class="doctor-specialty">${doctor.specialty}</span>
                </div>
                <button class="whatsapp-btn" onclick="openWhatsApp('${doctor.phone}', '${doctor.name}')">
                    <i class="fab fa-whatsapp"></i>
                </button>
            </div>
            
            <div class="doctor-details">
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${doctor.phone}</span>
                </div>
                ${optionalFields.join('')}
            </div>
        </div>
    `;
}

// Abrir WhatsApp
function openWhatsApp(phone, doctorName) {
    // Limpiar el número de teléfono
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Mensaje predeterminado
    const message = `Hola Dr./Dra. ${doctorName}, me interesa agendar una consulta. ¿Podrían ayudarme con información sobre disponibilidad?`;
    
    // URL de WhatsApp
    const whatsappURL = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappURL, '_blank');
}

// Agregar estilos para la animación del mensaje de éxito
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Funciones adicionales para mejorar la experiencia

// Validación de teléfono en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d+\s-]/g, '');
            e.target.value = value;
        });
    }
});

// Capitalizar nombre automáticamente
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('doctorName');
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            const words = e.target.value.split(' ');
            const capitalizedWords = words.map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            );
            e.target.value = capitalizedWords.join(' ');
        });
    }
});

// Función para limpiar localStorage (útil para desarrollo)
function clearAllData() {
    localStorage.removeItem('doctors');
    loadDoctors();
    renderDoctors();
    console.log('Datos limpiados');
}

// Función para exportar datos (útil para backup)
function exportData() {
    const data = {
        doctors: doctors,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `doctors_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Función para mostrar estadísticas (útil para admin)
function showStats() {
    const totalDoctors = doctors.length;
    const specialties = [...new Set(doctors.map(d => d.specialty))];
    const withClinics = doctors.filter(d => d.clinic).length;
    
    console.log(`
        === ESTADÍSTICAS ===
        Total de doctores: ${totalDoctors}
        Especialidades: ${specialties.length} (${specialties.join(', ')})
        Con clínica: ${withClinics}
        Datos estáticos: ${staticDoctors.length}
        Datos dinámicos: ${totalDoctors - staticDoctors.length}
    `);
}