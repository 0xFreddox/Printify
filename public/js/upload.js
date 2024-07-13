// Utilizza DOMContentLoaded per garantire che il documento sia completamente caricato
document.addEventListener('DOMContentLoaded', () => {
    // Dichiarazione della variabile fileInput all'inizio del codice
    const fileInput = document.getElementById('fileInput');

    const btnUpload = document.getElementById('btnUpload');
    
    const box_upload = document.getElementById('box_upload');



    btnUpload.addEventListener('click', ()  => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log("File Caricato");
            })
            .catch(error => {
                console.error("Si è verificato un problema:", error);
            });
        }
    });
});
