// Add Professional Modal Logic
const addProBtn = document.getElementById('add-pro-btn');
const addProModal = document.getElementById('add-pro-modal');
const closeModal = document.getElementById('close-modal');
const addProForm = document.getElementById('add-pro-form');

addProBtn.addEventListener('click', () => addProModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => addProModal.classList.add('hidden'));

addProForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPro = {
        name: document.getElementById('pro-name').value,
        title: document.getElementById('pro-title').value,
        location: document.getElementById('pro-location').value,
        lat: parseFloat(document.getElementById('pro-lat').value),
        lng: parseFloat(document.getElementById('pro-lng').value),
        rating: parseFloat(document.getElementById('pro-rating').value),
        bio: document.getElementById('pro-bio').value,
        skills: document.getElementById('pro-skills').value.split(',').map(s => s.trim())
    };

    professionals.push(newPro);
    professionalsGrid.appendChild(createProfessionalCard(newPro));

    // Add marker on map
    const marker = new google.maps.Marker({
        position: { lat: newPro.lat, lng: newPro.lng },
        map: map,
        title: newPro.name
    });
    markers.push(marker);

    addProModal.classList.add('hidden');
    addProForm.reset();
});

// Search Filter Logic (like BookMyShow filters)
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    professionalsGrid.innerHTML = '';
    professionals
        .filter(p => p.name.toLowerCase().includes(query) || 
                     p.title.toLowerCase().includes(query) || 
                     p.location.toLowerCase().includes(query))
        .forEach(pro => professionalsGrid.appendChild(createProfessionalCard(pro)));
});


// ... (your existing code) ...

// --- Add Professional Logic ---
if (addProfessionalForm) {
    const locationInput = document.getElementById('professional-location');
    // ... (your existing autocomplete setup) ...

    addProfessionalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const professional = {
            id: Date.now(),
            name: e.target.name.value,
            profession: e.target.profession.value,
            skills: e.target.skills.value,
            rate: e.target.rate.value,
            location: locationInput.value,
            phone: e.target.phone.value, // <-- ADDED THIS LINE
            portfolio: e.target.portfolio.value
        };

        const professionals = JSON.parse(localStorage.getItem('professionals')) || [];
        professionals.push(professional);
        localStorage.setItem('professionals', JSON.stringify(professionals));

        alert('Professional added successfully!');
        addProfessionalForm.reset();
    });
}

// ... (your existing code for professionals page) ...

// --- Professionals Page Logic (Updated) ---
if (professionalsList) {
    const displayProfessionals = (professionals) => {
        professionalsList.innerHTML = '';
        professionals.forEach(prof => {
            const card = document.createElement('div');
            card.classList.add('professional-card', 'fade-in');
            card.innerHTML = `
                <h3>${prof.name}</h3>
                <p><strong>Profession:</strong> ${prof.profession}</p>
                <p><strong>Skills:</strong> ${prof.skills}</p>
                <p><strong>Hourly Rate:</strong> $${prof.rate}</p>
                <p><strong>Location:</strong> ${prof.location}</p>
                <p><a href="${prof.portfolio}" target="_blank">Portfolio</a></p>
                <a href="booking.html?id=${prof.id}" class="btn">Book Now</a>
            `;
            professionalsList.appendChild(card);
        });
    };
    
    // ... (rest of this section is unchanged) ...
}

// --- Booking Page Logic (Updated) ---
if (bookingForm) {
    // Retrieve professional data using the ID from the URL
    const professionalId = new URLSearchParams(window.location.search).get('id');
    const professionals = JSON.parse(localStorage.getItem('professionals')) || [];
    const professional = professionals.find(p => p.id == professionalId);
    
    // Display the fetched professional details
    if (professional) {
        document.getElementById('booking-professional-name').textContent = professional.name;
        document.getElementById('booking-professional-profession').textContent = professional.profession;
        document.getElementById('booking-professional-rate').textContent = professional.rate;
    }

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // ... (your existing booking details object) ...

        const bookingDetails = {
            professionalId: professional.id, // Use the fetched professional's ID
            professionalName: professional.name,
            date: e.target.date.value,
            time: e.target.time.value,
            contactName: e.target.name.value,
            contactEmail: e.target.email.value,
            contactPhone: e.target.phone.value
        };
        
        // ... (your existing localStorage code) ...

        // --- WhatsApp Integration (Updated) ---
        const phoneNumber = professional.phone; // <-- Use the professional's specific phone number
        const messageText = `Hello, I would like to book a session with ${bookingDetails.professionalName} on ${bookingDetails.date} at ${bookingDetails.time}. My name is ${bookingDetails.contactName} and my contact number is ${bookingDetails.contactPhone}.`;
        
        const encodedMessage = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        
        alert('You will be redirected to WhatsApp to send your booking request.');
        bookingForm.reset();
    });
}