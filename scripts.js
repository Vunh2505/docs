document.addEventListener('DOMContentLoaded', function () {
    const fileList = document.getElementById('file-list');
    const contentDiv = document.getElementById('markdown-content');

    // A simulated list of markdown files and their paths
    const markdownFiles = [
        { name: "Chapter 1", file: "docs/chapter1.md" },
        { name: "Chapter 2", file: "docs/chapter2.md" },
        { name: "Section 1 / Topic 1", file: "docs/section1/topic1.md" },
        { name: "Section 1 / Topic 2", file: "docs/section1/topic2.md" },
        { name: "Section 2 / Topic 3", file: "docs/section2/topic3.md" },
    ];

    markdownFiles.forEach(doc => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = doc.name;
        a.dataset.file = doc.file;
        li.appendChild(a);
        fileList.appendChild(li);

        a.addEventListener('click', function (e) {
            e.preventDefault();
            loadMarkdown(this.dataset.file);
        });
    });

    function loadMarkdown(file) {
        fetch(file)
            .then(response => response.text())
            .then(text => {
                contentDiv.innerHTML = marked.parse(text);
            })
            .catch(error => console.error('Error loading markdown file:', error));
    }

    // Load the first file by default
    if (markdownFiles.length > 0) {
        loadMarkdown(markdownFiles[0].file);
    }
});
