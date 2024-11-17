document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const features = [
        { name: 'Patient Admission', icon: 'user-plus', fields: ['name', 'age', 'gender', 'address', 'phone', 'emergencyContact', 'admissionDate', 'admissionReason'] },
        { name: 'Patient Appointment', icon: 'calendar', fields: ['patientName', 'appointmentDate', 'appointmentTime', 'doctorName', 'appointmentReason'] },
        { name: 'Patient Discharge', icon: 'log-out', fields: ['patientName', 'dischargeDate', 'dischargeSummary', 'followUpInstructions'] },
        { name: 'Patient OPD/IPD System', icon: 'users', fields: ['patientName', 'department', 'doctorName', 'visitType', 'visitDate', 'symptoms', 'diagnosis', 'prescription'] },
        { name: 'Patient Bill Record', icon: 'file-text', fields: ['patientName', 'billDate', 'services', 'medications', 'roomCharges', 'doctorFees', 'totalAmount'] },
        { name: 'Discharge Certificate', icon: 'award', fields: ['patientName', 'admissionDate', 'dischargeDate', 'diagnosis', 'treatment', 'followUpInstructions'] },
        { name: 'Laboratory Reports', icon: 'microscope', fields: ['patientName', 'testName', 'testDate', 'results', 'normalRange', 'interpretation'] },
        { name: 'Store Inventory', icon: 'package', fields: ['itemName', 'category', 'quantity', 'unitPrice', 'supplier', 'expiryDate'] },
        { name: 'Purchase Inventory', icon: 'shopping-cart', fields: ['itemName', 'quantity', 'unitPrice', 'totalPrice', 'supplier', 'purchaseDate'] },
        { name: 'Trial Balance', icon: 'bar-chart-2', fields: ['accountName', 'debit', 'credit', 'balance'] },
        { name: 'Bar Code Support', icon: 'barcode', fields: ['itemName', 'barcode', 'quantity'] },
        { name: 'Account Ledger', icon: 'book-open', fields: ['accountName', 'date', 'description', 'debit', 'credit', 'balance'] },
        { name: 'Profit And Loss', icon: 'trending-up', fields: ['revenue', 'expenses', 'grossProfit', 'netProfit', 'profitMargin'] },
        { name: 'Birth Certificate', icon: 'baby', fields: ['childName', 'dateOfBirth', 'timeOfBirth', 'gender', 'weight', 'fatherName', 'motherName', 'placeOfBirth'] },
        { name: 'Death Certificate', icon: 'file-minus', fields: ['deceasedName', 'dateOfDeath', 'timeOfDeath', 'causeOfDeath', 'placeOfDeath', 'certifyingDoctor'] },
        { name: 'Detail Ledger', icon: 'file-text', fields: ['accountName', 'date', 'description', 'reference', 'debit', 'credit', 'balance'] },
        { name: 'GRN Report', icon: 'clipboard-list', fields: ['grnNumber', 'supplierName', 'receivedDate', 'itemName', 'quantity', 'unitPrice', 'totalPrice'] },
        { name: 'Pharmacy Sale', icon: 'pill', fields: ['customerName', 'medicationName', 'quantity', 'unitPrice', 'totalPrice', 'saleDate'] },
        { name: 'Radiology Reports', icon: 'clipboard-plus', fields: ['patientName', 'reportDate', 'radiologistName', 'findings', 'impression'] },
        { name: 'Complete Patient Data', icon: 'database', fields: ['patientName', 'age', 'gender', 'address', 'phone', 'emergencyContact', 'medicalHistory', 'allergies', 'currentMedications'] },
    ];

    const featureGrid = document.getElementById('feature-grid');
    const featureDetails = document.getElementById('feature-details');
    const submittedData = document.getElementById('submitted-data');
    const patientData = document.getElementById('patient-data');
    const featureTitle = document.getElementById('feature-title');
    const dataForm = document.getElementById('data-form');
    const backButton = document.getElementById('back-button');
    const submitButton = document.getElementById('submit-button');
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadWordButton = document.getElementById('download-word');
    const downloadPptButton = document.getElementById('download-ppt');
    const downloadExcelButton = document.getElementById('download-excel');
    const editDataButton = document.getElementById('edit-data');
    const deleteDataButton = document.getElementById('delete-data');
    const backToFormButton = document.getElementById('back-to-form');
    const homeButton = document.getElementById('home-button');

    let currentFeature = null;
    let formData = {};
    let uploadedFiles = {};
    let patientDatabase = [];

    function createFeatureCards() {
        features.forEach(feature => {
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.innerHTML = `
                <i data-lucide="${feature.icon}"></i>
                <h3>${feature.name}</h3>
            `;
            card.addEventListener('click', () => showFeatureDetails(feature));
            featureGrid.appendChild(card);
        });
        lucide.createIcons();
    }

    function showFeatureDetails(feature) {
        currentFeature = feature;
        featureGrid.style.display = 'none';
        featureDetails.style.display = 'block';
        submittedData.style.display = 'none';
        patientData.style.display = 'none';
        featureTitle.textContent = feature.name;
        createForm(feature);
    }

    function createForm(feature) {
        dataForm.innerHTML = '';
        if (feature.name === 'Radiology Reports') {
            const uploadArea = document.createElement('div');
            uploadArea.className = 'upload-area';
            uploadArea.innerHTML = `
                <p>Drag and drop files here or click to upload</p>
                <input type="file" accept=".pdf,.doc,.docx" multiple>
            `;
            uploadArea.addEventListener('click', () => uploadArea.querySelector('input').click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.backgroundColor = '#f0f0f0';
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.backgroundColor = '';
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.backgroundColor = '';
                handleFiles(e.dataTransfer.files);
            });
            uploadArea.querySelector('input').addEventListener('change', (e) => {
                handleFiles(e.target.files);
            });
            dataForm.appendChild(uploadArea);
        }
        feature.fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.charAt(0).toUpperCase() + field.slice(1) + ':';
            label.setAttribute('for', field);
            const input = document.createElement('input');
            input.type = 'text';
            input.name = field;
            input.id = field;
            dataForm.appendChild(label);
            dataForm.appendChild(input);
        });
    }

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            uploadedFiles[file.name] = file;
            const fileElement = document.createElement('div');
            fileElement.className = 'uploaded-file';
            fileElement.innerHTML = `
                <span>${file.name}</span>
                <button data-filename="${file.name}">Remove</button>
            `;
            fileElement.querySelector('button').addEventListener('click', (e) => {
                delete uploadedFiles[e.target.dataset.filename];
                fileElement.remove();
            });
            dataForm.appendChild(fileElement);
        });
    }

    function hideFeatureDetails() {
        featureGrid.style.display = 'grid';
        featureDetails.style.display = 'none';
        submittedData.style.display = 'none';
        patientData.style.display = 'none';
    }

    function handleSubmit(event) {
        event.preventDefault();
        formData = {};
        const inputs = dataForm.querySelectorAll('input');
        inputs.forEach(input => {
            formData[input.name] = input.value;
        });
        if (currentFeature.name === 'Complete Patient Data') {
            patientDatabase.push(formData);
        }
        displaySubmittedData();
        featureDetails.style.display = 'none';
        submittedData.style.display = 'block';
    }

    function displaySubmittedData() {
        const dataDisplay = document.getElementById('data-display');
        dataDisplay.innerHTML = '<h3>Saved Data:</h3>';
        for (const [key, value] of Object.entries(formData)) {
            const section = document.createElement('div');
            section.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span>${value}</span>`;
            dataDisplay.appendChild(section);
        }
        if (Object.keys(uploadedFiles).length > 0) {
            const filesSection = document.createElement('div');
            filesSection.innerHTML = '<strong>Uploaded Files:</strong>';
            Object.keys(uploadedFiles).forEach(filename => {
                const fileItem = document.createElement('div');
                fileItem.textContent = filename;
                filesSection.appendChild(fileItem);
            });
            dataDisplay.appendChild(filesSection);
        }
    }
    function generatePDF() {
        if (!currentFeature || !formData) {
            alert("No data available to generate the PDF!");
            return;
        }
    
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        doc.addImage('hospital-logo.png', 'PNG', 10, 10, 30, 30);
        doc.setFontSize(22);
        doc.setTextColor(0, 102, 204);
        doc.text('Peshawar Institute of Medical Sciences', 50, 25);
        doc.setFontSize(16);
        doc.setTextColor(51, 51, 51);
        doc.text('Hospital Management System', 50, 35);
    
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text(currentFeature.name, 14, 60);
    
        let yOffset = 70;
        doc.setFontSize(12);
    
        // Form Data Rendering
        for (const [key, value] of Object.entries(formData)) {
            if (yOffset > 280) {
                doc.addPage();
                yOffset = 20;
            }
            doc.setFont(undefined, 'bold');
            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, 14, yOffset);
            doc.setFont(undefined, 'normal');
            doc.text(value || 'N/A', 14, yOffset + 7);
            yOffset += 14;
        }
    
        // Uploaded Files Rendering
        if (Object.keys(uploadedFiles).length > 0) {
            doc.setFont(undefined, 'bold');
            doc.text('Uploaded Files:', 14, yOffset);
            yOffset += 7;
            doc.setFont(undefined, 'normal');
            Object.keys(uploadedFiles).forEach(filename => {
                doc.text(filename, 14, yOffset);
                yOffset += 7;
            });
        }
    
        doc.save(`${currentFeature.name.toLowerCase().replace(/ /g, '_')}_data.pdf`);
    }    

    function generateWord() {
        let content = `${currentFeature.name}\n\n`;
        for (const [key, value] of Object.entries(formData)) {
            content += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
        }
        if (Object.keys(uploadedFiles).length > 0) {
            content += '\nUploaded Files:\n';
            Object.keys(uploadedFiles).forEach(filename => {
                content += `${filename}\n`;
            });
        }
        const blob = new Blob([content], { type: 'application/msword' });
        saveAs(blob, `${currentFeature.name.toLowerCase().replace(/ /g, '_')}_data.doc`);
    }

    function generatePPT() {
        let content = `${currentFeature.name}\n\n`;
        for (const [key, value] of Object.entries(formData)) {
            content += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
        }
        if (Object.keys(uploadedFiles).length > 0) {
            content += '\nUploaded Files:\n';
            Object.keys(uploadedFiles).forEach(filename => {
                content += `${filename}\n`;
            });
        }
        const blob = new Blob([content], { type: 'application/vnd.ms-powerpoint' });
        saveAs(blob, `${currentFeature.name.toLowerCase().replace(/ /g, '_')}_data.ppt`);
    }

    function generateExcel() {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ['PIMS Peshawar'],
            ['Hospital Management System'],
            [currentFeature.name],
            []
        ];
        for (const [key, value] of Object.entries(formData)) {
            wsData.push([key.charAt(0).toUpperCase() + key.slice(1), value]);
        }
        if (Object.keys(uploadedFiles).length > 0) {
            wsData.push(['Uploaded Files']);
            Object.keys(uploadedFiles).forEach(filename => {
                wsData.push([filename]);
            });
        }
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, currentFeature.name);
        XLSX.writeFile(wb, `${currentFeature.name.toLowerCase().replace(/ /g, '_')}_data.xlsx`);
    }

    function handleEdit() {
        featureDetails.style.display = 'block';
        submittedData.style.display = 'none';
        const inputs = dataForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = formData[input.name] || '';
        });
    }

    function handleDelete() {
        if (confirm('Are you sure you want to delete this data?')) {
            formData = {};
            uploadedFiles = {};
            hideFeatureDetails();
        }
    }

    function showPatientData() {
        featureGrid.style.display = 'none';
        featureDetails.style.display = 'none';
        submittedData.style.display = 'none';
        patientData.style.display = 'block';
        displayPatientData();
    }

    function displayPatientData() {
        const patientList = document.getElementById('patient-list');
        patientList.innerHTML = '';
        patientDatabase.forEach((patient, index) => {
            const patientCard = document.createElement('div');
            patientCard.className = 'patient-card';
            patientCard.innerHTML = `
                <div class="patient-info">
                    <h3>${patient.patientName}</h3>
                    <p>Age: ${patient.age}, Gender: ${patient.gender}</p>
                </div>
                <div class="patient-actions">
                    <button class="download-pdf" data-index="${index}">PDF</button>
                    <button class="download-word" data-index="${index}">Word</button>
                    <button class="download-excel" data-index="${index}">Excel</button>
                </div>
            `;
            patientList.appendChild(patientCard);
        });
    }

    createFeatureCards();
    dataForm.addEventListener('submit', handleSubmit);
    backButton.addEventListener('click', hideFeatureDetails);
    submitButton.addEventListener('click', handleSubmit);
    downloadPdfButton.addEventListener('click', generatePDF);
    downloadWordButton.addEventListener('click', generateWord);
    downloadPptButton.addEventListener('click', generatePPT);
    downloadExcelButton.addEventListener('click', generateExcel);
    editDataButton.addEventListener('click', handleEdit);
    deleteDataButton.addEventListener('click', handleDelete);
    backToFormButton.addEventListener('click', () => {
        submittedData.style.display = 'none';
        featureDetails.style.display = 'block';
    });
    homeButton.addEventListener('click', hideFeatureDetails);

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('download-pdf')) {
            const index = e.target.dataset.index;
            generatePatientPDF(patientDatabase[index]);
        } else if (e.target.classList.contains('download-word')) {
            const index = e.target.dataset.index;
            generatePatientWord(patientDatabase[index]);
        } else if (e.target.classList.contains('download-excel')) {
            const index = e.target.dataset.index;
            generatePatientExcel(patientDatabase[index]);
        }
    });

    function generatePDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            // Rest of the code...
            doc.save(`${currentFeature.name.toLowerCase().replace(/ /g, '_')}_data.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }    
        
        doc.setFontSize(22);
        doc.setTextColor(0, 102, 204);
        doc.text('Patient Data', 14, 20);

        let yOffset = 40;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        for (const [key, value] of Object.entries(patient)) {
            doc.setFont(undefined, 'bold');
            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, 14, yOffset);
            doc.setFont(undefined, 'normal');
            doc.text(value, 14, yOffset + 7);
            yOffset += 14;
        }

        doc.save(`${patient.patientName.toLowerCase().replace(/ /g, '_')}_data.pdf`);
    }

    function generatePatientWord(patient) {
        let content = `Patient Data\n\n`;
        for (const [key, value] of Object.entries(patient)) {
            content += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
        }
        const blob = new Blob([content], { type: 'application/msword' });
        saveAs(blob, `${patient.patientName.toLowerCase().replace(/ /g, '_')}_data.doc`);
    }

    function generatePatientExcel(patient) {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Patient Data'],
            []
        ];
        for (const [key, value] of Object.entries(patient)) {
            wsData.push([key.charAt(0).toUpperCase() + key.slice(1), value]);
        }
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Patient Data');
        XLSX.writeFile(wb, `${patient.patientName.toLowerCase().replace(/ /g, '_')}_data.xlsx`);
    }
});