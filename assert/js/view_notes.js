let folders = JSON.parse(localStorage.getItem('folders')) || {};
        let currentFolder = 'All Notes';
        let currentNoteIndex = -1;
        let quill;

        function loadFolders() {
            const foldersList = document.getElementById('foldersList');
            foldersList.innerHTML = '';
            for (let folderName in folders) {
                const li = document.createElement('li');
                li.textContent = folderName;
                li.onclick = () => selectFolder(folderName);
                foldersList.appendChild(li);
            }
        }

        function selectFolder(folderName) {
            currentFolder = folderName;
            document.getElementById('currentFolderName').textContent = folderName;
            loadNotes();
        }

        function loadNotes() {
            const notesList = document.getElementById('notesList');
            notesList.innerHTML = '';
            folders[currentFolder].forEach((note, index) => {
                const li = document.createElement('li');
                li.textContent = note.substring(0, 50) + '...'; // Show first 50 characters
                li.onclick = () => editNote(index);
                notesList.appendChild(li);
            });
        }

        function editNote(index) {
            currentNoteIndex = index;
            quill.root.innerHTML = folders[currentFolder][index];
        }

        function saveEditedNote() {
            if (currentNoteIndex !== -1) {
                folders[currentFolder][currentNoteIndex] = quill.root.innerHTML;
                localStorage.setItem('folders', JSON.stringify(folders));
                loadNotes();
            }
        }

        window.onload = function() {
            quill = new Quill('#editor', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        ['clean']
                    ]
                }
            });

            loadFolders();
            selectFolder('All Notes');
        };