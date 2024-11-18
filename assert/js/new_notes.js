// Initialize folders and notes
let folders = JSON.parse(localStorage.getItem('folders')) || {};
let currentFolder = 'All Notes';
let currentNoteIndex = -1;
const API_KEY = localStorage.getItem('geminiApiKey');
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

function showPopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popupOverlay');
    overlay.style.display = 'block';
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

function hidePopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popupOverlay');
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
    setTimeout(() => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }, 50);
}

function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey.length == 39) {
        localStorage.setItem('geminiApiKey', apiKey);
        hidePopup();
    } else {
        alert("Vui lòng nhập đúng API Key")
        const input = document.getElementById('apiKeyInput');
        input.style.border = '1px solid #ff4444';
        setTimeout(() => {
            input.style.border = '1px solid rgba(0, 0, 0, 0.1)';
        }, 2000);
    }
}

// Check for API key on page load
if (!API_KEY) {
    showPopup();
}

// Load notes
function loadNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = ''; // Clear current notes list
    folders[currentFolder].forEach((note, index) => {
        const li = document.createElement('li');
        li.classList.add('note');
        
        // Process the note for display
        const processedNote = processNoteForDisplay(note);
        
        li.innerHTML = processedNote.substring(0, 50) + (processedNote.length > 50 ? '...' : '');
        li.onclick = () => showNotePage(index);
        notesList.appendChild(li);
    });
}

// Show note page
function showNotePage(index) {
    currentNoteIndex = index;
    const note = folders[currentFolder][index];
    document.getElementById('notePage').style.display = 'flex';
    
    // Process the note for display
    const processedNote = processNoteForDisplay(note);
    
    document.getElementById('notePageContent').innerHTML = processedNote;
}

// Helper function to process note for display
function processNoteForDisplay(note) {
    // Convert ** to <strong> tags for HTML display
    return note.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}


// Function to close note page
function closeNotePage() {
    document.getElementById('notePage').style.display = 'none';
}

// Function to edit note
function editNote() {
    const noteContent = document.getElementById('notePageContent');
    const currentText = noteContent.textContent;
    noteContent.innerHTML = `<textarea id="editNoteText" style="width: 90%; height: 200px;">${currentText}</textarea>`;
    noteContent.innerHTML += '<button onclick="saveEditedNote()">Save</button>';
}

// Function to save edited note
function saveEditedNote() {
    const editedText = document.getElementById('editNoteText').value;
    folders[currentFolder][currentNoteIndex] = editedText;
    localStorage.setItem('folders', JSON.stringify(folders));
    document.getElementById('notePageContent').textContent = editedText;
    loadNotes(); // Refresh the notes list
}

// Function to summarize note
function summarizeNote() {
    const note = folders[currentFolder][currentNoteIndex];
    showSummaryPage(note);
}


// Function to generate questions
function generateQuestions() {
    const note = folders[currentFolder][currentNoteIndex];
    // Implement question generation logic here
    alert("Question generation feature to be implemented");
}

// Load folders and notes
function loadFolders() {
    const foldersList = document.getElementById('foldersList');
    foldersList.innerHTML = ''; // Clear current folders list

    // Add the "All Notes" folder only if it's not present
    if (!folders['All Notes']) {
        folders['All Notes'] = [];
    }

    // Create folder list dynamically
    for (let folderName in folders) {
        const li = document.createElement('li');
        li.classList.add('folder');

        // Folder name display
        const folderNameText = document.createElement('span');
        folderNameText.classList.add('folder-name');
        folderNameText.textContent = folderName;

        // Delete button for folder
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteFolder(folderName);

        // Append the folder name and delete button to the list item
        li.appendChild(folderNameText);
        li.appendChild(deleteButton);
        li.onclick = () => selectFolder(folderName);

        foldersList.appendChild(li);
    }
}

// Add a new folder
function addFolder() {
    const folderInput = document.getElementById('folderInput').value.trim();
    if (folderInput && !folders[folderInput]) {
        folders[folderInput] = []; // Add new folder with empty notes
        localStorage.setItem('folders', JSON.stringify(folders));
        document.getElementById('folderInput').value = ''; // Clear input
        loadFolders(); // Reload folder list
    } else {
        alert('Thư mục đã có hoặc tên thư mục trống');
    }
}

// Select folder to view notes
function selectFolder(folderName) {
    currentFolder = folderName;
    document.getElementById('currentFolderName').textContent = folderName;
    loadNotes(); // Reload notes for the selected folder
}

async function saveNote() {
const noteInput = document.getElementById('noteInput').value.trim();
if (noteInput) {


// Convert <b> tags to ** for consistent storage
const processedNote = noteInput;

folders[currentFolder].push(processedNote);
localStorage.setItem('folders', JSON.stringify(folders));
document.getElementById('noteInput').value = ''; // Clear input
loadNotes(); // Reload notes
}
}

function deleteFolder(folderName) {
    if (folderName !== 'All Notes') {
        // Remove folder from storage
        delete folders[folderName];
        localStorage.setItem('folders', JSON.stringify(folders));

        // Reload the folder list
        loadFolders();

        // If the deleted folder was the current folder, reset to "All Notes"
        if (currentFolder === folderName) {
            currentFolder = 'All Notes';
            document.getElementById('currentFolderName').textContent = 'All Notes';
            loadNotes();
        }
    } else {
        alert('Cannot delete "All Notes" folder.');
    }
}

// Initialize app by loading folders and notes on page load
window.onload = function() {
    loadFolders();
    selectFolder('All Notes');
};


// New function to show summary page
function showSummaryPage(note) {
    if (!API_KEY) {
        alert("Vui lòng nhập API Key");
        showPopup();
    }else{
    document.getElementById('summaryPage').style.display = 'flex';
    document.getElementById('summaryContent').textContent = 'Đang tóm tắt nội dung...';
    
    // Call Gemini API to get summary
    fetchSummary(note);
    }
}

// Function to close summary page
function closeSummaryPage() {
    document.getElementById('summaryPage').style.display = 'none';
}

// Function to fetch summary from Gemini API
async function fetchSummary(note) {
    // Replace 'YOUR_API_KEY' with your actual Gemini API key
    
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Tóm tắt nội dung sau: ${note}`
                        }]
                    }]
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            const summary = data.candidates[0].content.parts[0].text;
            document.getElementById('summaryContent').textContent = summary;
        } catch (error) {
            console.error('Error:', error);
            alert("Lỗi API key, vui lòng nhập lại API key")
            document.getElementById('summaryContent').textContent = 'Lỗi khi tóm tắt nội dung, hãy thử lại';
            showPopup();
        }
    
}

async function generateFlashcardWithGemini(note) {
    if (!API_KEY) {
        alert("Vui lòng nhập API Key");
        showPopup();
    }else{
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Tạo một flashcard từ ghi chú sau. Flashcard nên có một bên là câu hỏi và một bên là câu trả lời. Câu hỏi nên kiểm tra khái niệm chính trong ghi chú và câu trả lời phải ngắn gọn nhưng đầy đủ thông tin. 
                            Định dạng câu trả lời dưới dạng văn bản thuần túy với tiền tố "Câu hỏi:" và "Trả lời:". Đây là ghi chú: ${note}`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const generatedText = data.candidates[0].content.parts[0].text;
            
            // Parse the generated text into question and answer
            const lines = generatedText.split('\n');
            let question = '';
            let answer = '';
            
            for (const line of lines) {
                if (line.startsWith('Câu hỏi:')) {
                    question = line.replace('Câu hỏi:', '').trim();
                } else if (line.startsWith('Trả lời:')) {
                    answer = line.replace('Trả lời:', '').trim();
                }
            }

            return { question, answer };
        } catch (error) {
            console.error('Error:', error);
            return { 
                question: 'Lỗi trong tạo câu hỏi', 
                answer: 'Lỗi tạo Flashcard, hãy thử lại!' 
            };
        }
    }
}

async function createFlashcard() {
    const note = folders[currentFolder][currentNoteIndex];
    const flashcard = await generateFlashcardWithGemini(note);
    displayFlashcardPopup(flashcard);
}

function displayFlashcardPopup(flashcard) {
    document.getElementById('flashcardQuestion').textContent = flashcard.question;
    document.getElementById('flashcardAnswer').textContent = flashcard.answer;
    document.getElementById('flashcardPopup').style.display = 'flex';
}

function closeFlashcardPopup() {
    document.getElementById('flashcardPopup').style.display = 'none';
}

async function generateQuestions() {
    const note = folders[currentFolder][currentNoteIndex];
    const questions = await generateQuestionsWithGemini(note);
    displayQuestionsPopup(questions);
}

async function generateQuestionsWithGemini(note) {
    if (!API_KEY) {
        alert("Vui lòng nhập API Key");
        showPopup();
    }else{
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Tạo 5 câu hỏi dựa trên ghi chú sau. Mỗi câu hỏi nên kiểm tra sự hiểu biết về một khái niệm quan trọng trong ghi chú. Định dạng câu trả lời dưới dạng danh sách được đánh số, mỗi câu hỏi nằm trên một dòng mới. Đây là ghi chú: ${note} thêm chấm hỏi vào cuối câu`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('Phản hồi lỗi');
            }

            const data = await response.json();
            const generatedText = data.candidates[0].content.parts[0].text;
            
            // Parse the generated text into an array of questions
            const questions = generatedText.split('\n')
                .filter(line => line.trim() !== '')
                .map(line => line.replace(/^\d+\.\s*/, '').trim());

            return questions;
        } catch (error) {
            console.error('Error:', error);
            return ['Lỗi tạo câu hỏi. Vui lòng thử lại!'];
        }
    }
}

function displayQuestionsPopup(questions) {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = ''; // Clear previous questions
    
    questions.forEach(question => {
        const li = document.createElement('li');
        li.textContent = question;
        questionsList.appendChild(li);
    });

    document.getElementById('questionsPopup').style.display = 'flex';
}

function closeQuestionsPopup() {
    document.getElementById('questionsPopup').style.display = 'none';
}