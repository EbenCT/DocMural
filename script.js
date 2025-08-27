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
let isEditorMode = false;
let currentEditingId = null;
const EDITOR_PIN = "1234";

// Elementos del DOM
const doctorsGrid = document.getElementById('doctorsGrid');
const searchInput = document.getElementById('searchInput');
const newRegistrationBtn = document.getElementById('newRegistrationBtn');
const registrationModal = document.getElementById('registrationModal');
const closeModal = document.getElementById('closeModal');
const doctorForm = document.getElementById('doctorForm');
const cancelBtn = document.getElementById('cancelBtn');
const noResults = document.getElementById('noResults');

// Editor mode elements
const editorModeBtn = document.getElementById('editorModeBtn');
const editorModeIndicator = document.getElementById('editorModeIndicator');
const exitEditorMode = document.getElementById('exitEditorMode');
const pinModal = document.getElementById('pinModal');
const closePinModal = document.getElementById('closePinModal');
const pinInput = document.getElementById('pinInput');
const validatePin = document.getElementById('validatePin');
const pinError = document.getElementById('pinError');

// Edit modal elements
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editDoctorForm = document.getElementById('editDoctorForm');
const cancelEdit = document.getElementById('cancelEdit');
const deleteDoctor = document.getElementById('deleteDoctor');
const addCustomField = document.getElementById('addCustomField');
const customFieldsContainer = document.getElementById('customFieldsContainer');

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
    
    // Editor mode
    editorModeBtn.addEventListener('click', openPinModal);
    exitEditorMode.addEventListener('click', exitEditorModeHandler);
    closePinModal.addEventListener('click', closePinModalHandler);
    validatePin.addEventListener('click', validatePinHandler);
    pinInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validatePinHandler();
        }
    });
    
    // Edit modal
    closeEditModal.addEventListener('click', closeEditModalHandler);
    cancelEdit.addEventListener('click', closeEditModalHandler);
    deleteDoctor.addEventListener('click', deleteDoctorHandler);
    addCustomField.addEventListener('click', addCustomFieldHandler);
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === registrationModal) {
            closeModalHandler();
        }
        if (event.target === pinModal) {
            closePinModalHandler();
        }
        if (event.target === editModal) {
            closeEditModalHandler();
        }
    });
    
    // Formularios
    doctorForm.addEventListener('submit', handleFormSubmit);
    editDoctorForm.addEventListener('submit', handleEditFormSubmit);
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

// ===== EDITOR MODE FUNCTIONS =====

// Abrir modal de PIN
function openPinModal() {
    pinModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    pinInput.focus();
    pinError.style.display = 'none';
}

// Cerrar modal de PIN
function closePinModalHandler() {
    pinModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    pinInput.value = '';
    pinError.style.display = 'none';
}

// Validar PIN
function validatePinHandler() {
    const enteredPin = pinInput.value.trim();
    
    if (enteredPin === EDITOR_PIN) {
        enableEditorMode();
        closePinModalHandler();
        showSuccessMessage('Modo editor activado');
    } else {
        pinError.style.display = 'block';
        pinInput.value = '';
        pinInput.focus();
        
        // Ocultar error después de 3 segundos
        setTimeout(() => {
            pinError.style.display = 'none';
        }, 3000);
    }
}

// Habilitar modo editor
function enableEditorMode() {
    isEditorMode = true;
    editorModeIndicator.style.display = 'block';
    editorModeBtn.style.display = 'none';
    renderDoctors(); // Re-renderizar con botones de edición
}

// Salir del modo editor
function exitEditorModeHandler() {
    isEditorMode = false;
    editorModeIndicator.style.display = 'none';
    editorModeBtn.style.display = 'flex';
    renderDoctors(); // Re-renderizar sin botones de edición
    showSuccessMessage('Modo editor desactivado');
}

// Abrir modal de edición
function openEditModal(doctorId) {
    if (!isEditorMode) return;
    
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    if (!doctor) return;
    
    currentEditingId = doctorId;
    populateEditForm(doctor);
    editModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Poblar formulario de edición
function populateEditForm(doctor) {
    document.getElementById('editDoctorId').value = doctor.id;
    document.getElementById('editDoctorName').value = doctor.name || '';
    document.getElementById('editSpecialty').value = doctor.specialty || '';
    document.getElementById('editPhone').value = doctor.phone || '';
    document.getElementById('editClinic').value = doctor.clinic || '';
    document.getElementById('editSchedule').value = doctor.schedule || '';
    document.getElementById('editAddress').value = doctor.address || '';
    document.getElementById('editExperience').value = doctor.experience || '';
    
    // Poblar campos personalizados
    populateCustomFields(doctor);
}

// Poblar campos personalizados
function populateCustomFields(doctor) {
    customFieldsContainer.innerHTML = '';
    
    const standardFields = ['id', 'name', 'specialty', 'phone', 'clinic', 'schedule', 'address', 'experience'];
    
    Object.keys(doctor).forEach(key => {
        if (!standardFields.includes(key) && doctor[key] !== null && doctor[key] !== undefined) {
            addCustomFieldToForm(key, doctor[key]);
        }
    });
}

// Agregar campo personalizado al formulario
function addCustomFieldToForm(fieldName = '', fieldValue = '') {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'custom-field-group';
    
    fieldDiv.innerHTML = `
        <input type="text" class="field-label" placeholder="Nombre del campo" value="${fieldName}">
        <input type="text" class="field-value" placeholder="Valor del campo" value="${fieldValue}">
        <button type="button" class="remove-field" onclick="removeCustomField(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    customFieldsContainer.appendChild(fieldDiv);
}

// Manejar agregar campo personalizado
function addCustomFieldHandler() {
    addCustomFieldToForm();
}

// Remover campo personalizado
function removeCustomField(button) {
    button.parentElement.remove();
}

// Cerrar modal de edición
function closeEditModalHandler() {
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    editDoctorForm.reset();
    customFieldsContainer.innerHTML = '';
    currentEditingId = null;
}

// Manejar envío del formulario de edición
function handleEditFormSubmit(event) {
    event.preventDefault();
    
    if (!currentEditingId) return;
    
    const formData = new FormData(editDoctorForm);
    const doctorIndex = doctors.findIndex(d => d.id === parseInt(currentEditingId));
    
    if (doctorIndex === -1) return;
    
    // Actualizar datos básicos
    doctors[doctorIndex] = {
        id: parseInt(currentEditingId),
        name: formData.get('name').trim(),
        specialty: formData.get('specialty').trim(),
        phone: formData.get('phone').trim(),
        clinic: formData.get('clinic') ? formData.get('clinic').trim() : null,
        schedule: formData.get('schedule') ? formData.get('schedule').trim() : null,
        address: formData.get('address') ? formData.get('address').trim() : null,
        experience: formData.get('experience') ? parseInt(formData.get('experience')) : null
    };
    
    // Agregar campos personalizados
    const customFields = customFieldsContainer.querySelectorAll('.custom-field-group');
    customFields.forEach(fieldGroup => {
        const fieldName = fieldGroup.querySelector('.field-label').value.trim();
        const fieldValue = fieldGroup.querySelector('.field-value').value.trim();
        
        if (fieldName && fieldValue) {
            doctors[doctorIndex][fieldName] = fieldValue;
        }
    });
    
    // Limpiar campos nulos/vacíos
    Object.keys(doctors[doctorIndex]).forEach(key => {
        if (doctors[doctorIndex][key] === null || doctors[doctorIndex][key] === '' || doctors[doctorIndex][key] === undefined) {
            delete doctors[doctorIndex][key];
        }
    });
    
    // Validar campos obligatorios
    if (!doctors[doctorIndex].name || !doctors[doctorIndex].specialty || !doctors[doctorIndex].phone) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    // Actualizar filteredDoctors
    filteredDoctors = [...doctors];
    
    // Guardar en localStorage
    saveDynamicDoctors();
    
    // Cerrar modal y actualizar vista
    closeEditModalHandler();
    renderDoctors();
    
    showSuccessMessage('Doctor actualizado exitosamente');
}

// Manejar eliminación de doctor
function deleteDoctorHandler() {
    if (!currentEditingId) return;
    
    const doctor = doctors.find(d => d.id === parseInt(currentEditingId));
    if (!doctor) return;
    
    const confirmDelete = confirm(`¿Está seguro de que desea eliminar a ${doctor.name}?\n\nEsta acción no se puede deshacer.`);
    
    if (confirmDelete) {
        // Remover doctor del array
        doctors = doctors.filter(d => d.id !== parseInt(currentEditingId));
        filteredDoctors = [...doctors];
        
        // Guardar en localStorage
        saveDynamicDoctors();
        
        // Cerrar modal y actualizar vista
        closeEditModalHandler();
        renderDoctors();
        
        showSuccessMessage('Doctor eliminado exitosamente');
    }
}

// Guardar doctores dinámicos en localStorage
function saveDynamicDoctors() {
    const dynamicDoctors = doctors.filter(doc => !staticDoctors.some(staticDoc => staticDoc.id === doc.id));
    localStorage.setItem('doctors', JSON.stringify(dynamicDoctors));
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
    
    // Limpiar campos nulos/vacíos
    Object.keys(newDoctor).forEach(key => {
        if (newDoctor[key] === null || newDoctor[key] === '' || newDoctor[key] === undefined) {
            delete newDoctor[key];
        }
    });
    
    // Validar campos obligatorios
    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.phone) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    // Agregar doctor a la lista
    doctors.push(newDoctor);
    filteredDoctors = [...doctors];
    
    // Guardar en localStorage
    saveDynamicDoctors();
    
    // Cerrar modal y actualizar vista
    closeModalHandler();
    renderDoctors();
    
    // Mostrar mensaje de éxito
    showSuccessMessage('Doctor registrado exitosamente');
}

// Mostrar mensaje de éxito
function showSuccessMessage(message = 'Operación exitosa') {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
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
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    messageDiv.innerHTML = `<i class="fas fa-check"></i> ${message}`;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
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
    
    // Campos estándar opcionales
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
    
    // Campos personalizados
    const standardFields = ['id', 'name', 'specialty', 'phone', 'clinic', 'schedule', 'address', 'experience'];
    Object.keys(doctor).forEach(key => {
        if (!standardFields.includes(key) && doctor[key] !== null && doctor[key] !== undefined && doctor[key] !== '') {
            optionalFields.push(`
                <div class="detail-item">
                    <i class="fas fa-info-circle"></i>
                    <span><strong>${key}:</strong> ${doctor[key]}</span>
                </div>
            `);
        }
    });
    
    // Botones de edición si está en modo editor
    const editButtons = isEditorMode ? `
        <div class="edit-buttons">
            <button class="edit-btn" onclick="openEditModal(${doctor.id})">
                <i class="fas fa-edit"></i>
                Editar
            </button>
        </div>
    ` : '';
    
    const cardClass = isEditorMode ? 'doctor-card editor-mode' : 'doctor-card';
    
    return `
        <div class="${cardClass}">
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
            
            ${editButtons}
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
    
    // También para el formulario de edición
    const editPhoneInput = document.getElementById('editPhone');
    if (editPhoneInput) {
        editPhoneInput.addEventListener('input', function(e) {
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
    
    // También para el formulario de edición
    const editNameInput = document.getElementById('editDoctorName');
    if (editNameInput) {
        editNameInput.addEventListener('input', function(e) {
            const words = e.target.value.split(' ');
            const capitalizedWords = words.map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            );
            e.target.value = capitalizedWords.join(' ');
        });
    }
});

// ===== FUNCIONES DE ADMINISTRACIÓN =====

// Función para limpiar localStorage (útil para desarrollo)
function clearAllData() {
    localStorage.removeItem('doctors');
    loadDoctors();
    renderDoctors();
    showSuccessMessage('Datos limpiados');
}

// Función para cambiar PIN (útil para administración)
function changeEditorPin(newPin) {
    if (typeof newPin !== 'string' || newPin.length < 4) {
        console.error('El PIN debe ser una cadena de al menos 4 caracteres');
        return false;
    }
    
    localStorage.setItem('editorPin', newPin);
    showSuccessMessage('PIN de editor actualizado');
    return true;
}

// Función para obtener estadísticas del modo editor
function getEditorStats() {
    const totalDoctors = doctors.length;
    const staticCount = staticDoctors.length;
    const dynamicCount = totalDoctors - staticCount;
    const specialties = [...new Set(doctors.map(d => d.specialty))];
    
    // Campos personalizados únicos
    const standardFields = ['id', 'name', 'specialty', 'phone', 'clinic', 'schedule', 'address', 'experience'];
    const customFields = new Set();
    
    doctors.forEach(doctor => {
        Object.keys(doctor).forEach(key => {
            if (!standardFields.includes(key)) {
                customFields.add(key);
            }
        });
    });
    
    const stats = {
        totalDoctors,
        staticDoctors: staticCount,
        dynamicDoctors: dynamicCount,
        specialties: specialties.length,
        specialtiesList: specialties,
        customFields: customFields.size,
        customFieldsList: [...customFields],
        editorModeActive: isEditorMode
    };
    
    console.log('=== ESTADÍSTICAS DEL EDITOR ===');
    console.log(`Total de doctores: ${stats.totalDoctors}`);
    console.log(`Doctores estáticos: ${stats.staticDoctors}`);
    console.log(`Doctores dinámicos: ${stats.dynamicDoctors}`);
    console.log(`Especialidades: ${stats.specialties}`);
    console.log(`Campos personalizados: ${stats.customFields}`);
    console.log(`Modo editor activo: ${stats.editorModeActive ? 'Sí' : 'No'}`);
    
    return stats;
}

// Función para exportar datos con campos personalizados
function exportDataWithCustomFields() {
    const data = {
        doctors: doctors,
        totalDoctors: doctors.length,
        staticDoctors: staticDoctors.length,
        dynamicDoctors: doctors.length - staticDoctors.length,
        customFields: getCustomFieldsUsed(),
        exportDate: new Date().toISOString(),
        version: '2.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `doctors_backup_with_custom_fields_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showSuccessMessage('Datos exportados exitosamente');
}

// Obtener campos personalizados utilizados
function getCustomFieldsUsed() {
    const standardFields = ['id', 'name', 'specialty', 'phone', 'clinic', 'schedule', 'address', 'experience'];
    const customFields = {};
    
    doctors.forEach(doctor => {
        Object.keys(doctor).forEach(key => {
            if (!standardFields.includes(key)) {
                if (!customFields[key]) {
                    customFields[key] = 0;
                }
                customFields[key]++;
            }
        });
    });
    
    return customFields;
}

// Función para limpiar campos personalizados huérfanos
function cleanCustomFields() {
    let cleaned = 0;
    
    doctors.forEach(doctor => {
        Object.keys(doctor).forEach(key => {
            if (doctor[key] === null || doctor[key] === undefined || doctor[key] === '') {
                delete doctor[key];
                cleaned++;
            }
        });
    });
    
    if (cleaned > 0) {
        saveDynamicDoctors();
        filteredDoctors = [...doctors];
        renderDoctors();
        showSuccessMessage(`${cleaned} campos vacíos eliminados`);
    } else {
        showSuccessMessage('No hay campos vacíos para limpiar');
    }
    
    return cleaned;
}