document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const features = [
        { name: 'Patient Admission', icon: 'user-plus', fields: ['name', 'age', 'gender', 'address', 'phone', 'emergencyContact', 'admissionDate', 'admissionReason'] },
        { name: 'Patient Appointment', icon: 'calendar', fields: ['patient Name', 'appointmentDate', 'appointmentTime', 'doctorName', 'appointmentReason'] },
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
    ];

    const radiologyTypes = [
        'Ultrasound',
        'MRI',
        'X-Ray',
        'Mammography',
        'Fluoroscopy',
        'Bone Scan'
    ];

    const featureGrid = document.getElementById('feature-grid');
    const featureDetails = document.getElementById('feature-details');
    const submittedData = document.getElementById('submitted-data');
    const featureTitle = document.getElementById('feature-title');
    const dataForm = document.getElementById('data-form');
    const backButton = document.getElementById('back-button');
    const submitButton = document.getElementById('submit-button');
    const downloadPdfButton = document.getElementById('download-pdf');
    const downloadExcelButton = document.getElementById('download-excel');
    const editDataButton = document.getElementById('edit-data');
    const deleteDataButton = document.getElementById('delete-data');
    const backToFormButton = document.getElementById('back-to-form');
    const homeButton = document.getElementById('home-button');

    let currentFeature = null;
    let formData = {};
    let uploadedFiles = {};

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
        featureTitle.textContent = feature.name;
        createForm(feature);
    }

    function createForm(feature) {
        dataForm.innerHTML = '';
        if (feature.name === 'Radiology Reports') {
            radiologyTypes.forEach(type => {
                const uploadDiv = document.createElement('div');
                uploadDiv.className = 'radiology-upload';
                uploadDiv.innerHTML = `
                    <label for="${type}">${type} Report:</label>
                    <input type="file" id="${type}" name="${type}" accept=".pdf,.jpg,.png">
                    <input type="text" name="${type}Identifier" placeholder="Identify ${type} report">
                `;
                dataForm.appendChild(uploadDiv);
            });
        } else {
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
    }

    function hideFeatureDetails() {
        featureGrid.style.display = 'grid';
        featureDetails.style.display = 'none';
        submittedData.style.display = 'none';
    }

    function handleSubmit(event) {
        event.preventDefault();
        formData = {};
        uploadedFiles = {};
        const inputs = dataForm.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'file') {
                if (input.files.length > 0) {
                    uploadedFiles[input.name] = input.files[0];
                    formData[input.name] = input.files[0].name;
                }
            } else {
                formData[input.name] = input.value;
            }
        });
        displaySubmittedData();
        featureDetails.style.display = 'none';
        submittedData.style.display = 'block';
    }

    function displaySubmittedData() {
        const dataDisplay = document.getElementById('data-display');
        dataDisplay.innerHTML = '<h3>Saved Data:</h3>';
        for (const [key, value] of Object.entries(formData)) {
            if (value) {
                const section = document.createElement('div');
                section.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <span>${value}</span>`;
                dataDisplay.appendChild(section);
            }
        }
    }

    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add logo and text
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
        for (const [key, value] of Object.entries(formData)) {
            if (value) {
                if (yOffset > 280) {
                    doc.addPage();
                    yOffset = 20;
                }
                doc.setFont(undefined, 'bold');
                doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, 14, yOffset);
                doc.setFont(undefined, 'normal');
                doc.text(value, 14, yOffset + 7);
                yOffset += 14;
            }
        }

        doc.save(`${currentFeature.name.toLowerCase().replace(/ /g, '_')}_data.pdf`);
    }

    function generateExcel() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([formData]);
        
        // Add logo and text to the first row
        XLSX.utils.sheet_add_aoa(ws, [
            ['PIMS Peshawar'],
            ['Hospital Management System'],
            [currentFeature.name],
            []  // Empty row for spacing
        ], { origin: 'A1' });

        // Style the header
        ws['!cols'] = [{ wch: 30 }, { wch: 50 }];  // Set column widths
        ['A1', 'A2', 'A3'].forEach(cell => {
            ws[cell].s = { font: { bold: true, color: { rgb: "0066CC" } } };
        });

        XLSX.utils.book_append_sheet(wb, ws, currentFeature.name);
        XLSX.writeFile(wb, `${currentFeature.name.toLowerCase().replace(/ /g, '_')}_data.xlsx`);
    }

    function handleEdit() {
        featureDetails.style.display = 'block';
        submittedData.style.display = 'none';
        const inputs = dataForm.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type !== 'file') {
                input.value = formData[input.name] || '';
            }
        });
    }

    function handleDelete() {
        if (confirm('Are you sure you want to delete this data?')) {
            formData = {};
            uploadedFiles = {};
            hideFeatureDetails();
        }
    }

    createFeatureCards();
    dataForm.addEventListener('submit', handleSubmit);
    backButton.addEventListener('click', hideFeatureDetails);
    submitButton.addEventListener('click', handleSubmit);
    downloadPdfButton.addEventListener('click', generatePDF);
    downloadExcelButton.addEventListener('click', generateExcel);
    editDataButton.addEventListener('click', handleEdit);
    deleteDataButton.addEventListener('click', handleDelete);
    backToFormButton.addEventListener('click', () => {
        submittedData.style.display = 'none';
        featureDetails.style.display = 'block';
    });
    homeButton.addEventListener('click', hideFeatureDetails);
});